/* istanbul ignore file */
import { handler } from './settings/show.js';
import { dumpCommand } from '../ux/dump.js';

export const command = 'settings [command]';

export const desc = 'Manage CLI settings';

export const builder = (yargs) => yargs
  .commandDir('settings')
  .example(
    dumpCommand('vonage settings show'),
    'Show the current CLI settings',
  )
  .example(
    dumpCommand('vonage settings set no-color <on|off>'),
    'Set the default color output preference',
  );

export { handler };
