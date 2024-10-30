#!/usr/bin/env -S node
const chalk = require('chalk');
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs');
const { setConfig } = require('../src/middleware/config');
const { setupLog } = require('../src/middleware/log');

yargs(hideBin(process.argv))
  .fail((msg, err, yargs) => {
    yargs.showHelp();
    console.log('');
    console.error(chalk.red('Error:'), msg);
  })
  .options({
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
    'no-color': {
      describe: 'Toggle color output off',
      type: 'boolean',
    },
  })
  .middleware(setupLog)
  .middleware(setConfig)
  .scriptName('vonage')
  .commandDir('../src/commands')
  .demandCommand()
  .help()
  .alias('help', 'h')
  .wrap(yargs.terminalWidth())
  .parse();


