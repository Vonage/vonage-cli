import { WhatsAppSticker } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
  whatsappMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'sticker';

export const desc = 'Send a WhatsApp sticker message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'id': {
      describe: 'The WhatsApp sticker ID',
      type: 'string',
      group: 'WhatsApp Message',
    },
    'url': whatsappMediaUrlOption,
    ...whatsappCommonOptions,
  })
  .check((argv) => {
    if (!argv.id && !argv.url) {
      throw new Error('Either --id or --url is required');
    }

    if (argv.id && argv.url) {
      throw new Error('Only one of --id or --url may be used');
    }

    return true;
  })
  .demandOption(['to', 'from'])
  .example(
    dumpCommand('vonage message send whatsapp sticker --to <number> --from <number> --id <sticker-id>'),
    'Send a WhatsApp sticker by ID',
  )
  .example(
    dumpCommand('vonage message send whatsapp sticker --to <number> --from <number> --url <url>'),
    'Send a WhatsApp sticker by URL',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp sticker message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppSticker({
      ...buildWhatsAppMessage(argv),
      sticker: argv.id
        ? { id: argv.id }
        : { url: argv.url },
    }),
  );
};
