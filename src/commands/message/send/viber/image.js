import { ViberImage } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildViberMessage,
  buildViberService,
  viberCommonOptions,
  viberMediaUrlOption,
  viberServiceOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'image';

export const desc = 'Send a Viber image message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': viberMediaUrlOption,
    'caption': {
      describe: 'Optional caption for the image',
      type: 'string',
      group: 'Viber Message',
    },
    ...viberServiceOptions,
    ...viberCommonOptions,
  })
  .demandOption(['to', 'from', 'url', 'viber-type', 'category', 'action-url', 'action-text'])
  .example(
    dumpCommand('vonage message send viber image --to <number> --from <sender> --url <url> --ttl <seconds> --viber-type <type> --category <category> --action-url <url> --action-text <text>'),
    'Send a Viber image message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Viber image message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new ViberImage({
      ...buildViberMessage(argv),
      image: {
        url: argv.url,
        caption: argv.caption,
      },
      viberService: buildViberService(argv),
    }),
  );
};
