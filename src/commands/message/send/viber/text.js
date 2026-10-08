import { ViberText } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildViberMessage,
  buildViberService,
  viberCommonOptions,
  viberServiceOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'text';

export const desc = 'Send a Viber text message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'text': {
      describe: 'The message text',
      type: 'string',
      group: 'Viber Message',
    },
    ...viberServiceOptions,
    ...viberCommonOptions,
  })
  .demandOption(['to', 'from', 'text', 'viber-type', 'category', 'action-url', 'action-text'])
  .example(
    dumpCommand('vonage message send viber text --to <number> --from <sender> --text <text> --ttl <seconds> --viber-type <type> --category <category> --action-url <url> --action-text <text>'),
    'Send a Viber text message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Viber text message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new ViberText({
      ...buildViberMessage(argv),
      text: argv.text,
      viberService: buildViberService(argv),
    }),
  );
};
