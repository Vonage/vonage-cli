import { MessengerFile } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildMessengerMessage,
  messengerCommonOptions,
  messengerMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'file';

export const desc = 'Send a Messenger file message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': messengerMediaUrlOption,
    ...messengerCommonOptions,
  })
  .demandOption(['to', 'from', 'category', 'url'])
  .example(
    dumpCommand('vonage message send messenger file --to <id> --from <id> --category <category> --url <url>'),
    'Send a Messenger file message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Messenger file message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MessengerFile({
      ...buildMessengerMessage(argv),
      file: {
        url: argv.url,
      },
    }),
  );
};
