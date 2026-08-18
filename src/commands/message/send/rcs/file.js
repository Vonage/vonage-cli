import { RCSFile } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildRCSMessage,
  rcsCommonOptions,
  rcsMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'file';

export const desc = 'Send an RCS file message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': rcsMediaUrlOption,
    ...rcsCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send rcs file --to <number> --from <sender> --url <url>'),
    'Send an RCS file message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending RCS file message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new RCSFile({
      ...buildRCSMessage(argv),
      file: {
        url: argv.url,
      },
    }),
  );
};
