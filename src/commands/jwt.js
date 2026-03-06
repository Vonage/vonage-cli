/* istanbul ignore file */
export const command = 'jwt <command>';

export const desc = 'Manage JWT tokens';

export const builder = (yargs) => yargs.commandDir('jwt');

export const handler = () => {};
