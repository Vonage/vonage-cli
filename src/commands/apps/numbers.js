const { handler, builder } = require('./numbers/show');
exports.command = 'numbers <command>';

exports.desc = 'Manage application numbers';

exports.builder = (yargs) => yargs.commandDir('numbers');

exports.handler = handler;

