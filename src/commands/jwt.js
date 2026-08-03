import { dumpCommand } from '../ux/dump.js';

/* istanbul ignore file */
export const command = 'jwt <command>';

export const desc = 'Manage JWT tokens';

export const builder = (yargs) => yargs.commandDir('jwt')
  .example(
    dumpCommand('vonage jwt create'),
    'Create a JWT',
  );

export const handler = () => {};
