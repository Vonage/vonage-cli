import { RCSText } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildRCSMessage,
  rcsCommonOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';
import { coerceJSON } from '../../../../utils/coerceJSON.js';

export const command = 'text';

export const desc = 'Send an RCS text message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'text': {
      describe: 'The message text',
      type: 'string',
      group: 'RCS Message',
    },
    'suggestions': {
      describe: 'Optional RCS suggestions as JSON',
      type: 'string',
      group: 'RCS Message',
      coerce: coerceJSON('suggestions'),
    },
    ...rcsCommonOptions,
  })
  .demandOption(['to', 'from', 'text'])
  .example(
    dumpCommand('vonage message send rcs text --to <number> --from <sender> --text <text>'),
    'Send an RCS text message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending RCS text message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new RCSText({
      ...buildRCSMessage(argv),
      text: argv.text,
      suggestions: argv.suggestions,
    }),
  );
};
