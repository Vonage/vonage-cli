import { makeSDKCall } from '../../utils/makeSDKCall.js';
import yargs from 'yargs';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { force } from '../../commonFlags.js';
import { spinner } from '../../ux/spinner.js';
import { confirm } from '../../ux/confirm.js';
import { inputFromTTY } from '../../ux/input.js';
import { hideCursor, resetCursor } from '../../ux/cursor.js';
import ngrok from 'ngrok';
import { EOL } from 'os';

export const command = 'ngrok <id>';

export const desc = 'Open an ngrok tunnel for application';

/* istanbul ignore next */
export const builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application',
    },
  )
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'auth-token': {
      describe: 'Ngrok auth token',
      type: 'string',
      group: 'Ngrok',
    },
    'force': force,
    'subdomain': {
      describe: 'Set an ngrok subdomain',
      type: 'string',
      group: 'Ngrok',
    },
    'port': {
      describe: 'The port ngrok will forward too',
      type: 'number',
      default: 3000,
      group: 'Ngrok',
    },
    'region': {
      describe: 'One of the ngrok regions',
      choices: ['us', 'eu', 'au', 'ap', 'sa', 'jp', 'in'],
      default: 'us',
      group: 'Ngrok',
    },
  });

const updateHooks = (config, ngrokUrl) => Object.entries(config).reduce(
  (acc, [key, value]) => {
    const varType = Array.isArray(value) ? 'array' : typeof value;

    if (varType === 'object') {
      acc[key] = updateHooks(value, ngrokUrl);
      return acc;
    }

    if (key !== 'address') {
      acc[key] = value;
      return acc;
    }

    const webhookUrl = new URL(value);
    webhookUrl.host = ngrokUrl.host;
    acc[key] = webhookUrl.toString();
    return acc;
  },
  {},
);

export const handler = async (argv) => {
  console.info(`Opening ngrok tunnel for application ${argv.id}`);
  console.log('⚠️ ⚠️ This will update the all the WebHooks for your application ⚠️ ⚠️ ');
  console.log('This will cause WebHooks to directed to Ngrok instead of your servers');
  console.log('Use caution when using with production applications.');
  console.log('You have been warned');
  console.log('');

  const okToProceed = await confirm('Are you sure you want to continue? [y/n]');

  if (!okToProceed) {
    console.debug('User does not like to take risks');
    yargs.exit(1);
    return;
  }

  console.debug('YOLO');

  const { SDK, id } = argv;

  const app = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );

  let ngrokUrl;
  const ngrokConfig = {
    authtoken: argv.authToken,
    region: argv.region,
    addr: argv.port,
    subdomain: argv.subdomain,
  };
  console.debug('Ngrok config', ngrokConfig);

  const { stop, fail } = spinner({
    message: `Opening ${argv.region} ngrok tunnel to port ${argv.port}`,
  });

  try {
    ngrokUrl = new URL(await ngrok.connect(ngrokConfig));
    stop();
  } catch (error) {
    fail();
    console.log('');
    console.error('Unable to open ngrok tunnel');
    const reason = error?.body?.details?.err;
    console.log(reason || error);
    yargs.exit(69);
    return;
  }

  console.debug(`Ngrok URL ${ngrokUrl}`);

  const updatedApp = updateHooks(app, ngrokUrl);

  console.debug('New application config', updatedApp);

  console.debug('Updating application');
  await makeSDKCall(
    SDK.applications.updateApplication.bind(SDK.applications),
    'Updating application webhooks',
    updatedApp,
  );

  const ngrokApi = ngrok.getApi();
  const { tunnels } = await ngrokApi.listTunnels();

  const { config } = tunnels[0] || {};

  console.log('');
  console.log('Ngrok is running');
  console.log(`Forwarding: ${ngrokUrl.toString()} -> ${config?.addr}`);
  console.log('Web Interface: http://127.0.0.1:4040');
  hideCursor();
  process.stdout.write('Press q to quit');

  const controller = new AbortController();
  try {
    await inputFromTTY({
      signal: controller.signal,
      echo: false,
      onKeyPress: (_, str) => {
        if (str !== 'q') {
          return;
        }

        controller.abort('Shutdown');
        process.stdout.write(EOL);
      },
    });
  } catch (err) {
    if (String(err) !== 'Shutdown') {
      console.error('Unexpected error', err);
    }
  } finally {
    console.log('');
    const { stop } = spinner({
      message: 'Shutting down ngrok',
    });
    await ngrok.disconnect();
    await ngrok.kill();
    stop();
  }

  console.debug('Reverting application');
  await makeSDKCall(
    SDK.applications.updateApplication.bind(SDK.applications),
    'Reverting application webhooks',
    app,
  );
  resetCursor();
};
