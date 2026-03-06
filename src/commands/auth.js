/* istanbul ignore file */
import { handler } from './auth/show.js';
import { dumpCommand } from '../ux/dump.js';

export const command = 'auth [command]';

export const description = 'Manage authentication information',

export const builder = (yargs) => yargs
  .commandDir('auth')
  .epilogue([
    `When ${dumpCommand('command')} is not passed, ${dumpCommand('vonage auth')} will function the same as ${dumpCommand('vonage auth show')}.`,
    '',
    `For more information, type ${dumpCommand('vonage auth show --help')}`,
  ].join('\n'));

export { handler };
