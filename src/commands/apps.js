/* istanbul ignore file */
const { handler} = require('./apps/list');
const { dumpCommand } = require('../ux/dump');

exports.command = 'apps [command]';

exports.desc = 'Manage applications';

exports.builder = (yargs) => yargs.commandDir('apps')
  .epilogue(`When no command is given, ${dumpCommand('vonage apps')} will act the same as ${dumpCommand('vonage apps list')}. Run ${dumpCommand('vonage apps --help')} to see options.`);

exports.handler = handler;

