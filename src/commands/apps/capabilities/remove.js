const { displayApplication } = require('../../../apps/display');
const { getAppCapabilities, capabilities, capabilityLabels } = require('../../../apps/capabilities');
const { makeSDKCall } = require('../../../utils/makeSDKCall');
const { apiKey, apiSecret } = require('../../../credentialFlags');
const { dumpCommand } = require('../../../ux/dump');
const { confirm } = require('../../../ux/confirm');
const { force } = require('../../../commonFlags');

exports.command = 'rm <id> <which>';

exports.description = 'Remove a capability from an application';

exports.builder = (yargs) => yargs
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'force': force,
  })
  .example(
    dumpCommand('$0 apps capabilities rm 000[...]000 network_apis'),
    'Remove the network_apis capability from application',
  )
  .positional(
    'which',
    {
      describe: 'Capability to remove',
      choices: capabilities,
    },
  )
  .positional(
    'id',
    {
      type: 'string',
      describe: 'The application ID',
    },
  );

exports.handler = async (argv) => {
  const { SDK, id, which } = argv;
  console.info(`Removing ${which} capability from application ${id}`);

  const app = await makeSDKCall(SDK.applications.getApplication, 'Fetching Application', id);
  console.log('');
  console.debug(`Loaded application ${app.name} (${app.id})`);
  console.debug(`Current capabilities: ${getAppCapabilities(app).length}`);

  if (getAppCapabilities(app).length < 1) {
    console.log('No capabilities to remove');
    return;
  }

  const okToRemove = await confirm(`Remove ${capabilityLabels[which]} capability from ${app.name} (${app.id})?`);
  console.log('');

  if (okToRemove) {
    app.capabilities[which === 'network_apis' ? 'networkApis' : which] = undefined;
    await makeSDKCall(
      SDK.applications.updateApplication,
      `Removing ${which} capability from application ${id}`,
      app,
    );
  }

  console.log( okToRemove
    ? `Removed ${capabilityLabels[which]} capability from ${app.name}`
    : `Did not remove ${capabilityLabels[which]} capability from ${app.name}`,
  );

  console.log('');
  displayApplication(app);
};
