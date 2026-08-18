import { WhatsAppFile } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
  whatsappMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'file';

export const desc = 'Send a WhatsApp file message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': whatsappMediaUrlOption,
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send whatsapp file --to <number> --from <number> --url <url>'),
    'Send a WhatsApp file message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp file message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppFile({
      ...buildWhatsAppMessage(argv),
      file: {
        url: argv.url,
      },
    }),
  );
};
