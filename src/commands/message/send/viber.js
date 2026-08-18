/* node:coverage disable */
import { dumpCommand } from '../../../ux/dump.js';

export const command = 'viber <command>';

export const desc = 'Send a Viber Service message';

export const builder = (yargs) => yargs
  .commandDir('viber')
  .example(
    dumpCommand('vonage message send viber text --to <number> --from <sender> --text <text> --ttl <seconds> --viber-type <type> --category <category> --action-url <url> --action-text <text>'),
    'Send a Viber text message',
  );

export const handler = () => { };
