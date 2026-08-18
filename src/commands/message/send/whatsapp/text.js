import { WhatsAppText } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'text';

export const desc = 'Send a WhatsApp text message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'text': {
      describe: 'The message text',
      type: 'string',
      group: 'WhatsApp Message',
    },
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'text'])
  .example(
    dumpCommand('vonage message send whatsapp text --to <number> --from <number> --text <text>'),
    'Send a WhatsApp text message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp text message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppText({
      ...buildWhatsAppMessage(argv),
      text: argv.text,
    }),
  );
};
