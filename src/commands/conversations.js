/* istanbul ignore file */
const { handler} = require('./conversations/list');
const { dumpCommand } = require('../ux/dump');

exports.command = 'conversations [command]';

exports.desc = 'Manage conversations';

exports.builder = (yargs) => yargs.commandDir('conversations')
  .epilogue(`When no command is given, ${dumpCommand('vonage conversations')} will act the same as ${dumpCommand('vonage conversations list')}. Run ${dumpCommand('vonage conversations list --help')} to see options.`);

exports.handler = handler;
