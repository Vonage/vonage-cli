/* istanbul ignore file */
export const command = 'tunnel <which>';

export const desc = 'Open a tunnel in order to test webhooks';

export const builder = (yargs) => yargs.commandDir('tunnel');

export const handler = () => { };
