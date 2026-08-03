/* istanbul ignore file */
import { handler } from './numbers/list.js';
import { dumpCommand } from '../../ux/dump.js';

export const command = 'numbers <command>';

export const desc = 'Manage application numbers';

export const builder = (yargs) => yargs.commandDir('numbers')
  .example(
    dumpCommand('vonage apps numbers list <id>'),
    'List numbers linked to an application',
  );

export { handler };
