import { WhatsAppAudio } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
  whatsappMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'audio';

export const desc = 'Send a WhatsApp audio message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': whatsappMediaUrlOption,
    'caption': {
      describe: 'Optional caption for the audio',
      type: 'string',
      group: 'WhatsApp Message',
    },
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send whatsapp audio --to <number> --from <number> --url <url>'),
    'Send a WhatsApp audio message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp audio message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppAudio({
      ...buildWhatsAppMessage(argv),
      audio: {
        url: argv.url,
        caption: argv.caption,
      },
    }),
  );
};
