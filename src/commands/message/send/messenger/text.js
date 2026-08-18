import { MessengerText } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildMessengerMessage,
  messengerCommonOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'text';

export const desc = 'Send a Messenger text message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'text': {
      describe: 'The message text',
      type: 'string',
      group: 'Messenger Message',
    },
    ...messengerCommonOptions,
  })
  .demandOption(['to', 'from', 'category', 'text'])
  .example(
    dumpCommand('vonage message send messenger text --to <id> --from <id> --category <category> --text <text>'),
    'Send a Messenger text message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Messenger text message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MessengerText({
      ...buildMessengerMessage(argv),
      text: argv.text,
    }),
  );
};
