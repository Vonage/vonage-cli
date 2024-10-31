/* istanbul ignore file */
const { handler} = require('./numbers/list');
const { dumpCommand } = require('../ux/dump');

exports.command = 'numbers [command]';

exports.desc = 'Manage numbers';

exports.builder = (yargs) => yargs.commandDir('numbers')
  .epilogue(`When no command is given, ${dumpCommand('vonage numbers')} will act the same as ${dumpCommand('vonage numbers list')}. Run ${dumpCommand('vonage numbers list --help')} to see options.`);

exports.handler = handler;
