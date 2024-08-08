#!/usr/bin/env -S node
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs');
const { getVonageAuth } = require('../src/middleware/vonageAuth');
const { setupLog } = require('../src/middleware/log');
const { readFileSync, existsSync } = require('node:fs');

yargs(hideBin(process.argv))
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
      coerce: (arg) => existsSync(arg)
        ? readFileSync(arg, 'utf-8')
        : arg,
    },
    'app-id': {
      describe: 'Your Vonage application ID',
      group: 'Vonage Credentials:',
      type: 'string',
    },
    'verbose': {
      alias: 'v',
      describe: 'Print more information',
      type: 'boolean',
      group: 'UX',
    },
    'debug': {
      alias: 'd',
      describe: 'Print debug information',
      type: 'boolean',
      group: 'UX',
    },
  })
  .middleware(setupLog)
  .middleware(getVonageAuth)
  .commandDir('../src/commands')
  .demandCommand()
  .help()
  .parse();


