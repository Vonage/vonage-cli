/* istanbul ignore file */
const { handler} = require('./users/list');
const { dumpCommand } = require('../ux/dump');

exports.command = 'users [command]';

exports.desc = 'Manage users';

exports.builder = (yargs) => yargs.commandDir('users')
  .epilogue(`When no command is given, ${dumpCommand('vonage users')} will act the same as ${dumpCommand('vonage users list')}. Run ${dumpCommand('vonage users list --help')} to see options.`);

exports.handler = handler;

