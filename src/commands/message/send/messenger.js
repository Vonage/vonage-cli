/* istanbul ignore file */
import { dumpCommand } from '../../../ux/dump.js';

export const command = 'messenger <command>';

export const desc = 'Send a Facebook Messenger message';

export const builder = (yargs) => yargs
  .commandDir('messenger')
  .example(
    dumpCommand('vonage message send messenger text --to <id> --from <id> --category <category> --text <text>'),
    'Send a Messenger text message',
  );

export const handler = () => {};
