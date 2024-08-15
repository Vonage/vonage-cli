const { dumpValue } = require('../ux/dump');
const yaml = require('yaml');

// eslint-disable-next-line no-unused-vars
const removeSource = ({source, ...rest}) => rest;

exports.command = 'auth [command]';

exports.desc = 'Manage authentication information';

exports.builder = (yargs) => yargs.options({
  'yaml': {
    describe: 'Output as YAML',
    type: 'boolean',
    conflicts: 'json',
  },
  'json': {
    describe: 'Output as JSON',
    type: 'boolean',
    conflicts: 'yaml',
  },
  'local': {
    describe: 'Display local configuration only',
    type: 'boolean',
    conflicts: 'global',
  },
  'global': {
    describe: 'Display global configuration only',
    type: 'boolean',
    conflicts: 'local',
  },
}).commandDir('auth');

exports.handler = async (argv) => {
  console.info('Displaying auth information');
  const { config } = argv;
  console.debug('Configuration:', config);

  let authData = {
    apiKey: argv.apiKey,
    apiSecret: argv.apiSecret,
    privateKey: argv.privateKey,
    appId: argv.appId,
    source: argv.source,
  };

  if (argv.local) {
    authData ={
      source: 'Local file',
      apiKey: config.local.apiKey,
      apiSecret: config.local.apiSecret,
      privateKey: config.local.privateKey,
      appId: config.local.appId,
    };
  }

  if (argv.global) {
    authData = {
      source: 'Global file',
      apiKey: config.global.apiKey,
      apiSecret: config.global.apiSecret,
      privateKey: config.global.privateKey,
      appId: config.global.appId,
    };
  }

  if (argv.json) {
    console.log(JSON.stringify(
      {
        apiKey: authData.apiKey,
        apiSecret: authData.apiSecret,
        privateKey: authData.privateKey,
        appId: authData.appId,
      },
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(yaml.stringify(
      {
        apiKey: authData.apiKey,
        apiSecret: authData.apiSecret,
        privateKey: authData.privateKey,
        appId: authData.appId,
      },
    ));
    return;
  }

  console.log('Auth Information');
  console.log('');
  console.table([
    {
      'Source': dumpValue(authData.source),
      'API Key': dumpValue(authData.apiKey),
      'API Secret': dumpValue(authData.apiSecret),
      'Private Key': dumpValue(authData.privateKey),
      'Application ID': dumpValue(authData.appId),
    },
  ]);
  console.log('');
  console.log(`The local configuration file is ${config.localConfigFile}`);
  console.log(`The global configuration file is ${config.globalConfigFile}`);

};
