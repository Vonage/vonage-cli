#!/usr/bin/env -S node
const chalk = require('chalk');
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs');
const { setConfig } = require('../src/middleware/config');
const { setupLog } = require('../src/middleware/log');
const { coerceKey } = require('../src/utils/coerceKey');

yargs(hideBin(process.argv))
  .fail((msg, err, yargs) => {
    console.error(chalk.red('Error:'), msg);
    console.log('');
    yargs.showHelp();
  })
  .options({
    'api-key': {
      describe: 'Your Vonage API key',
      type: 'string',
      group: 'Vonage Credentials:',
      implies: 'api-secret',
    },
    'api-secret': {
      describe: 'Your Vonage API secret',
      type: 'string',
      implies: 'api-key',
      group: 'Vonage Credentials:',
    },
    'private-key': {
      describe: 'Your Vonage private key',
      type: 'string',
      group: 'Vonage Credentials:',
      implies: 'app-id',
      coerce: coerceKey('private'),
    },
    'app-id': {
      describe: 'Your Vonage application ID',
      group: 'Vonage Credentials:',
      type: 'string',
      implies: 'private-key',
    },
    'verbose': {
      alias: 'v',
      describe: 'Print more information',
      type: 'boolean',
    },
    'debug': {
      alias: 'd',
      describe: 'Print debug information',
      type: 'boolean',
    },
    'force': {
      alias: 'f',
      describe: 'Force the command to run without confirmation',
      type: 'boolean',
    },
    'color': {
      describe: 'Turn on color output',
      type: 'boolean',
      default: true,
    },
  })
  .middleware(setupLog)
  .middleware(setConfig)
  .scriptName('vonage')
  .commandDir('../src/commands')
  .demandCommand()
  .help()
  .parse();


