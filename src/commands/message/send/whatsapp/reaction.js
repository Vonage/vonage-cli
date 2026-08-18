import { WhatsAppReaction } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import { buildWhatsAppMessage, whatsappCommonOptions } from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'reaction';

export const desc = 'Send a WhatsApp reaction message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'action': {
      describe: 'Whether to add or remove a reaction',
      choices: ['react', 'unreact'],
      type: 'string',
      group: 'WhatsApp Message',
    },
    'emoji': {
      describe: 'The emoji to use when reacting',
      type: 'string',
      group: 'WhatsApp Message',
    },
    ...whatsappCommonOptions,
  })
  .demandOption(['to', 'from', 'action'])
  .example(
    dumpCommand('vonage message send whatsapp reaction --to <number> --from <number> --action <react|unreact> --emoji <emoji>'),
    'Send a WhatsApp reaction message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending WhatsApp reaction message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new WhatsAppReaction({
      ...buildWhatsAppMessage(argv),
      reaction: {
        action: argv.action,
        emoji: argv.emoji,
      },
    }),
  );
};
