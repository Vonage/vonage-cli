import { MessengerImage } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildMessengerMessage,
  messengerCommonOptions,
  messengerMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'image';

export const desc = 'Send a Messenger image message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': messengerMediaUrlOption,
    'caption': {
      describe: 'Optional caption for the image',
      type: 'string',
      group: 'Messenger Message',
    },
    ...messengerCommonOptions,
  })
  .demandOption(['to', 'from', 'category', 'url'])
  .example(
    dumpCommand('vonage message send messenger image --to <id> --from <id> --category <category> --url <url>'),
    'Send a Messenger image message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Messenger image message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MessengerImage({
      ...buildMessengerMessage(argv),
      image: {
        url: argv.url,
        caption: argv.caption,
      },
    }),
  );
};
