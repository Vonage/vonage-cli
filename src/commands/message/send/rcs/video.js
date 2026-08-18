import { RCSVideo } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildRCSMessage,
  rcsCommonOptions,
  rcsMediaUrlOption,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'video';

export const desc = 'Send an RCS video message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': rcsMediaUrlOption,
    ...rcsCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send rcs video --to <number> --from <sender> --url <url>'),
    'Send an RCS video message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending RCS video message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new RCSVideo({
      ...buildRCSMessage(argv),
      video: {
        url: argv.url,
      },
    }),
  );
};
