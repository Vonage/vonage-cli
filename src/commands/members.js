/* istanbul ignore file */
const { handler} = require('./members/list');
const { dumpCommand } = require('../ux/dump');

exports.command = 'members [command]';

exports.desc = 'Manage applications';

exports.builder = (yargs) => yargs.commandDir('members')
  .epilogue(`When no command is given, ${dumpCommand('vonage members')} will act the same as ${dumpCommand('vonage members list')}. Run ${dumpCommand('vonage members list --help')} to see options.`);

exports.handler = handler;
