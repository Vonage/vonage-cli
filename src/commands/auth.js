/* istanbul ignore file */
const { handler } = require('./auth/show');
const { dumpCommand } = require('../ux/dump');

exports.command = 'auth [command]';

exports.description = 'Manage authentication information',

exports.builder = (yargs) => yargs
  .commandDir('auth')
  .epilogue([
    `When ${dumpCommand('command')} is not passed, ${dumpCommand('vonage auth')} will function the same as ${dumpCommand('vonage auth show')}.`,
    '',
    `For more information, type ${dumpCommand('vonage auth show --help')}`,
  ].join('\n'));

exports.handler = handler;
