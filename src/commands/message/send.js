/* istanbul ignore file */
import { dumpCommand } from '../../ux/dump.js';

export const command = 'send <command>';

export const desc = 'Send a message on a specific channel';

export const builder = (yargs) => yargs
  .commandDir('send')
  .example(
    dumpCommand('vonage message send sms --to <number> --from <number> --text <text>'),
    'Send an SMS message',
  );

export const handler = () => {};
