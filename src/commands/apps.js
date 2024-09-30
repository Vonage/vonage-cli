const { handler, flags} = require('./apps/list');

exports.command = 'apps [command]';

exports.desc = 'Manage applications';

exports.builder = (yargs) => yargs.options(flags).commandDir('apps');

exports.handler = handler;

