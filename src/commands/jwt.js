/* istanbul ignore file */
exports.command = 'jwt <command>';

exports.desc = 'Manage JWT tokens';

exports.builder = (yargs) => yargs.commandDir('jwt');

exports.handler = () => {};
