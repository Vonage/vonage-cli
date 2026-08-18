import { MessengerAudio } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildMessengerMessage,
  messengerCommonOptions,
  messengerMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'audio';

export const desc = 'Send a Messenger audio message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': messengerMediaUrlOption,
    ...messengerCommonOptions,
  })
  .demandOption(['to', 'from', 'category', 'url'])
  .example(
    dumpCommand('vonage message send messenger audio --to <id> --from <id> --category <category> --url <url>'),
    'Send a Messenger audio message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Messenger audio message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MessengerAudio({
      ...buildMessengerMessage(argv),
      audio: {
        url: argv.url,
      },
    }),
  );
};
