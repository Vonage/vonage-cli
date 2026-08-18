import { RCSCustom } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildRCSMessage,
  rcsCommonOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';
import { coerceJSON } from '../../../../utils/coerceJSON.js';

export const command = 'custom';

export const desc = 'Send an RCS custom message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    ...rcsCommonOptions,
    'custom': {
      describe: 'The custom RCS payload as JSON',
      type: 'string',
      group: 'RCS Message',
      coerce: coerceJSON('custom'),
    },
  })
  .demandOption(['to', 'from', 'custom'])
  .example(
    dumpCommand('vonage message send rcs custom --to <number> --from <sender> --custom <json>'),
    'Send an RCS custom message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending RCS custom message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new RCSCustom({
      ...buildRCSMessage(argv),
      custom: argv.custom,
    }),
  );
};
