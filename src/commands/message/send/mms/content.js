import { MMSContent } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import { coerceJSON } from '../../../../utils/coerceJSON.js';
import { mmsCommonOptions } from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'content';

export const desc = 'Send an MMS content message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'content': {
      describe: 'The MMS content array as JSON',
      type: 'string',
      group: 'MMS Message',
      coerce: (value) => {
        const parsed = coerceJSON('content')(value);
        if (!Array.isArray(parsed)) {
          throw new Error('content must be a JSON array');
        }

        return parsed;
      },
    },
    ...mmsCommonOptions,
  })
  .demandOption(['to', 'from', 'content'])
  .example(
    dumpCommand('vonage message send mms content --to <number> --from <number> --content <json-array>'),
    'Send an MMS content message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending MMS content message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MMSContent({
      to: argv.to,
      from: argv.from,
      content: argv.content,
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
      ttl: argv.ttl,
    }),
  );
};
