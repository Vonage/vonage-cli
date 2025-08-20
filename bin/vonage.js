#!/usr/bin/env -S node
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs');
const { setConfig } = require('../src/middleware/config');
const { setupLog } = require('../src/middleware/log');
const { checkForUpdate } = require('../src/middleware/update');
const { dumpCommand } = require('../src/ux/dump');
const { getSettings } = require('../src/utils/settings');
const settings = getSettings();

const { needsUpdate, forceUpdate, forceMinVersion } = settings;

if (needsUpdate) {
  const settings = getSettings();
  const { latestVersion } = settings;
  console.log(`An update is available for the CLI. Please update to version ${latestVersion}`);
  console.log(`Run ${dumpCommand(`npm install -g @vonage/cli@${latestVersion}`)} to update`);
}

const vonageCLI = yargs(hideBin(process.argv))
  .fail((_, err) => {
    yargs.showHelp();
    if (err) {
      console.log('');
      console.error(err.message);
      console.log('');
      console.log('Please report this error to GitHub: https://github.com/vonage/vonage-cli');
    }
    yargs.exit(99);
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
  .middleware(checkForUpdate)
  .scriptName('vonage')
  .commandDir('../src/commands')
  .demandCommand()
  .showHelpOnFail(false)
  .help()
  .alias('help', 'h')
  .wrap(yargs.terminalWidth());

const run = async () => {
  if (forceUpdate) {
    console.log(`A critical update is available for the CLI. Please update to version ${forceMinVersion}`);
    console.log(`Run ${dumpCommand(`npm install -g @vonage/cli@${forceMinVersion}`)} to update`);
    return;
  }

  vonageCLI.parse();
};
run();
