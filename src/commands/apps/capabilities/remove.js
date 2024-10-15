const { displayApplication } = require('../../../apps/display');
const { writeAppToSDK } = require('../../../apps/writeAppToSDK');
const { loadAppFromSDK } = require('../../../apps/loadAppFromSDK');
const { capabilities } = require('../../../apps/capabilities');

exports.command = 'rm <id> <which>';

exports.desc = 'Remove a capability from an application';

exports.builder = (yargs) => yargs
  .positional(
    'which',
    {
      describe: 'Capability to add, update or remove',
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
  const { id, which } = argv;
  console.info(`Removing ${which} capability from application ${id}`);

  const app = await loadAppFromSDK(argv.SDK, id);
  console.debug(`Loaded application ${app.name} (${app.id})`);

  if (!app.capabilities) {
    app.capabilities = {};
  }

  app.capabilities[which === 'network_apis' ? 'networkApis' : which] = undefined;

  await writeAppToSDK(argv.SDK, app);
  displayApplication(app);
};
