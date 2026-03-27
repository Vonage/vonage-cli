#!/usr/bin/env -S node

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import { setConfig } from '../src/middleware/config.js';
import { setupLog } from '../src/middleware/log.js';
import { checkForUpdate } from '../src/middleware/update.js';
import { dumpCommand } from '../src/ux/dump.js';
import { getSettings } from '../src/utils/settings.js';
const settings = getSettings();

const { forceUpdate, forceMinVersion } = settings;
const yargsInstance = yargs(hideBin(process.argv));

const vonageCLI = yargsInstance.fail((_, err) => {
  yargsInstance.showHelp();
  if (err) {
    console.log('');
    console.error(err.message);
    console.log('');
    console.log('Please report this error to GitHub: https://github.com/vonage/vonage-cli');
  }
  yargsInstance.exit(99);
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
  .wrap(yargsInstance.terminalWidth());

const run = async () => {
  if (forceUpdate) {
    console.log(`A critical update is available for the CLI. Please update to version ${forceMinVersion}`);
    console.log(`Run ${dumpCommand(`npm install -g @vonage/cli@${forceMinVersion}`)} to update`);
    return;
  }

  vonageCLI.parse();
};
run();
