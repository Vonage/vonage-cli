/* node:coverage disable */
import { dumpCommand } from '../../../ux/dump.js';

export const command = 'whatsapp <command>';

export const desc = 'Send a WhatsApp message';

export const builder = (yargs) => yargs
  .commandDir('whatsapp')
  .example(
    dumpCommand('vonage message send whatsapp text --to <number> --from <number> --text <text>'),
    'Send a WhatsApp text message',
  );

export const handler = () => { };
