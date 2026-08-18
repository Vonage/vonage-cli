import { WhatsAppImage } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
  whatsappMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'image';

export const desc = 'Send a WhatsApp image message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': whatsappMediaUrlOption,
    'caption': {
      describe: 'Optional caption for the image',
      type: 'string',
      group: 'WhatsApp Message',
    },
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send whatsapp image --to <number> --from <number> --url <url>'),
    'Send a WhatsApp image message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp image message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppImage({
      ...buildWhatsAppMessage(argv),
      image: {
        url: argv.url,
        caption: argv.caption,
      },
    }),
  );
};
