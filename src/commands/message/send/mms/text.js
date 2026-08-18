import { MMSText } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import { mmsCommonOptions } from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'text';

export const desc = 'Send an MMS text message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'text': {
      describe: 'The message text',
      type: 'string',
      group: 'MMS Message',
    },
    ...mmsCommonOptions,
  })
  .demandOption(['to', 'from', 'text'])
  .example(
    dumpCommand('vonage message send mms text --to <number> --from <number> --text <text>'),
    'Send an MMS text message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending MMS text message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MMSText({
      to: argv.to,
      from: argv.from,
      text: argv.text,
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
      ttl: argv.ttl,
    }),
  );
};
