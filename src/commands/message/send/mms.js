/* node:coverage disable */
import { dumpCommand } from '../../../ux/dump.js';

export const command = 'mms <command>';

export const desc = 'Send an MMS message';

export const builder = (yargs) => yargs
  .commandDir('mms')
  .example(
    dumpCommand('vonage message send mms text --to <number> --from <number> --text <text>'),
    'Send an MMS text message',
  )
  .example(
    dumpCommand('vonage message send mms image --to <number> --from <number> --url <url>'),
    'Send an MMS image message',
  )
  .example(
    dumpCommand('vonage message send mms content --to <number> --from <number> --content <json-array>'),
    'Send an MMS content message',
  );

export const handler = () => { };
