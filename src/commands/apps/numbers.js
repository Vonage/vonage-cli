/* istanbul ignore file */
const { handler } = require('./numbers/list');

exports.command = 'numbers <command>';

exports.desc = 'Manage application numbers';

exports.builder = (yargs) => yargs.commandDir('numbers');

exports.handler = handler;

