/* istanbul ignore file */
exports.command = 'tunnel <which>';

exports.desc = 'Open a tunnel in order to test webhooks';

exports.builder = (yargs) => yargs.commandDir('tunnel');

exports.handler = () => { };
