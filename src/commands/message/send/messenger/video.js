import { MessengerVideo } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildMessengerMessage,
  messengerCommonOptions,
  messengerMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'video';

export const desc = 'Send a Messenger video message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': messengerMediaUrlOption,
    'caption': {
      describe: 'Optional caption for the video',
      type: 'string',
      group: 'Messenger Message',
    },
    ...messengerCommonOptions,
  })
  .demandOption(['to', 'from', 'category', 'url'])
  .example(
    dumpCommand('vonage message send messenger video --to <id> --from <id> --category <category> --url <url>'),
    'Send a Messenger video message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Messenger video message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MessengerVideo({
      ...buildMessengerMessage(argv),
      video: {
        url: argv.url,
        caption: argv.caption,
      },
    }),
  );
};
