import { WhatsAppVideo } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
  whatsappMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'video';

export const desc = 'Send a WhatsApp video message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': whatsappMediaUrlOption,
    'caption': {
      describe: 'Optional caption for the video',
      type: 'string',
      group: 'WhatsApp Message',
    },
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send whatsapp video --to <number> --from <number> --url <url>'),
    'Send a WhatsApp video message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp video message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppVideo({
      ...buildWhatsAppMessage(argv),
      video: {
        url: argv.url,
        caption: argv.caption,
      },
    }),
  );
};
