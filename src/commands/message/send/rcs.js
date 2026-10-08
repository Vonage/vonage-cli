/* node:coverage disable */
import { dumpCommand } from '../../../ux/dump.js';

export const command = 'rcs <command>';

export const desc = 'Send an RCS message';

export const builder = (yargs) => yargs
  .commandDir('rcs')
  .example(
    dumpCommand('vonage message send rcs text --to <number> --from <sender> --text <text>'),
    'Send an RCS text message',
  );

export const handler = () => { };
