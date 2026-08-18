/* istanbul ignore file */
import { dumpCommand } from '../ux/dump.js';

export const command = 'message <command>';

export const desc = 'Send messages through the Messages API';

export const builder = (yargs) => yargs
  .commandDir('message')
  .example(
    dumpCommand('vonage message send sms --to <number> --from <number> --text <text>'),
    'Send an SMS message',
  );

export const handler = () => {};
