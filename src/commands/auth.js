const { handler, flags } = require('./auth/show');

exports.command = 'auth [command]';

exports.desc = 'Manage authentication information';

exports.builder = (yargs) => yargs.options(flags).commandDir('auth');

exports.handler = handler;
