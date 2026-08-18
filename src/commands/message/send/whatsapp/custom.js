import { WhatsAppCustom } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildWhatsAppMessage,
  whatsappCommonOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';
import { coerceJSON } from '../../../../utils/coerceJSON.js';

export const command = 'custom';

export const desc = 'Send a WhatsApp custom message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'custom': {
      describe: 'The custom WhatsApp payload as JSON',
      type: 'string',
      group: 'WhatsApp Message',
      coerce: coerceJSON('custom'),
    },
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'custom'])
  .example(
    dumpCommand('vonage message send whatsapp custom --to <number> --from <number> --custom <json>'),
    'Send a WhatsApp custom message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp custom message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppCustom({
      ...buildWhatsAppMessage(argv),
      custom: argv.custom,
    }),
  );
};
