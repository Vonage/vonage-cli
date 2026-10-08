import { ViberFile } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildViberMessage,
  viberCommonOptions,
  viberMediaUrlOption,
  viberServiceOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'file';

export const desc = 'Send a Viber file message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': viberMediaUrlOption,
    'name': {
      describe: 'The name and extension of the file',
      type: 'string',
      group: 'Viber Message',
    },
    ...viberServiceOptions,
    ...viberCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send viber file --to <number> --from <sender> --url <url>'),
    'Send a Viber file message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Viber file message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new ViberFile({
      ...buildViberMessage(argv),
      file: {
        url: argv.url,
        name: argv.name,
      },
    }),
  );
};
