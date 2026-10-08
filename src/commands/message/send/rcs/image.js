import { RCSImage } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildRCSMessage,
  rcsCommonOptions,
  rcsMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'image';

export const desc = 'Send an RCS image message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': rcsMediaUrlOption,
    ...rcsCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send rcs image --to <number> --from <sender> --url <url>'),
    'Send an RCS image message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending RCS image message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new RCSImage({
      ...buildRCSMessage(argv),
      image: {
        url: argv.url,
      },
    }),
  );
};
