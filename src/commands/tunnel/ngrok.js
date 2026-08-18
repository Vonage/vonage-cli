import { makeSDKCall } from '../../utils/makeSDKCall.js';
import yargs from 'yargs';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { force } from '../../commonFlags.js';
import { spinner } from '../../ux/spinner.js';
import { confirm } from '../../ux/confirm.js';
import { inputFromTTY } from '../../ux/input.js';
import { hideCursor, resetCursor } from '../../ux/cursor.js';
import ngrok from '@ngrok/ngrok';
import { EOL } from 'os';
import { dumpCommand } from '../../ux/dump.js';
import dotenv from 'dotenv';

dotenv.config();

const y = yargs();
export const command = 'ngrok <id>';

export const desc = 'Open an ngrok tunnel for an application';

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
  })
  .example(
    dumpCommand('vonage tunnel ngrok <id> [--port <port>]'),
    'Open an ngrok tunnel for an application',
  );

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
    y.exit(1);
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
  const ngrokAuth = argv.authToken // CLI argument takes precedence
    ?? process.env.NGROK_AUTHTOKEN // Latest recommendation from ngrok
    ?? process.env.NGROK_AUTH_TOKEN; // Previous recommendation from ngrok


  const proceed = !ngrokAuth
    ? await confirm(
      '‼️ Unable to verify the ngrok authentication token proceed? ‼️',
      { noForce: true }
    )
    : true;

  if (!proceed) {
    console.error('Cannot open ngrok tunnel without the ngrok authentication token');
    console.error('');
    console.error('If you have not created a token, see https://dashboard.ngrok.com/get-started/your-authtoken');
    console.error('');
    console.error(`Once you have created the token, add ${dumpCommand('NGROK_AUTHTOKEN')} to your environment variables`);
    y.exit(1);
  }

  const ngrokConfig = {
    ...(ngrokAuth ? { authtoken: ngrokAuth } : { auth_from_env: true }),
    region: argv.region,
    addr: argv.port,
    subdomain: argv.subdomain,
  };

  console.debug('Ngrok config', ngrokConfig);

  const { stop, fail } = spinner({
    message: `Opening ${argv.region} ngrok tunnel to port ${argv.port}`,
  });

  try {
    const forwarder = await ngrok.forward(ngrokConfig);
    ngrokUrl = new URL(forwarder.url());
    stop();
  } catch (error) {
    fail();
    console.debug('Ngrok Error', error);
    console.log('');
    console.error('Unable to open ngrok tunnel');
    const reason = error?.body?.details?.err;
    console.log(reason || error);
    y.exit(69);
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

  console.log('');
  console.log('Ngrok is running');
  console.log(`Forwarding: ${ngrokUrl.toString()} -> localhost:${argv.port}`);
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
