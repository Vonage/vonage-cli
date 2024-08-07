#!/usr/bin/env -S node
const { hideBin } = require('yargs/helpers');
const yargs = require('yargs');
const { getVonageAuth } = require('./middleware/vonageAuth');

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


