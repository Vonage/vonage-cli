#!/usr/bin/env -S node
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs');
const { Auth } = require('@vonage/auth');
const rc = require('rc');

const getVonageAuth = async (argv) => {
  // Use any of the args passed in
  if (argv.apiKey || argv.apiSecret || argv.privateKey || argv.appId) {
    return {
      Auth: new Auth({
        apiKey: argv['api-key'],
        apiSecret: argv['api-secret'],
        privateKey: argv['private-key'],
        applicationId: argv['app-id'],
      })
    };
  }

  // TODO: Find global config
  // Check XDG_CONFIG_HOME and the windows one (rc will not this)

  // TODO Find nexmo cli config
  const authConfig = rc('vonage',{});
  if (!authConfig) {
    return {};

  }
  const normalConfig = Object.fromEntries(
    Object.entries(authConfig).map(
    ([key, value]) => [
      key.toUpperCase().replace(/-/g, '_'),
      value
    ])
  );

  return {
    Auth: new Auth({
      apiKey: normalConfig.API_KEY,
      apiSecret: normalConfig.API_SECRET,
      privateKey: normalConfig.PRIVATE_KEY,
      applicationId: normalConfig.APP_ID,
    })
  };
};

yargs(hideBin(process.argv))
  .options({
    'api-key': {
      describe: 'Your Vonage API key',
      type: 'string',
    },
    'api-secret': {
      describe: 'Your Vonage API secret',
      type: 'string',
    },
    'private-key': {
      describe: 'Your Vonage private key',
      type: 'string',
    },
    'app-id': {
      describe: 'Your Vonage application ID',
      type: 'string',
    },
    'verbose': {
      describe: 'Print more information',
      type: 'boolean',
    },
    'debug': {
      describe: 'Print debug information',
      type: 'boolean',
    },
  })
  .middleware(getVonageAuth)
  .commandDir('commands')
  .demandCommand()
  .help()
  .parse();


