import { dumpCommand } from '../../ux/dump.js';

/* istanbul ignore file */
export const command = 'capabilities <action>';

export const desc = 'Manage application capabilities';

export const builder = (yargs) => yargs.commandDir('capabilities')
  .example(
    dumpCommand('vonage apps capabilities rm <id> <which>'),
    'Remove an application capability',
  );
