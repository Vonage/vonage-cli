import { MMSFile } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import { captionOption, mediaUrlOption, mmsCommonOptions } from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'file';

export const desc = 'Send an MMS file message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': mediaUrlOption,
    'caption': captionOption,
    ...mmsCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send mms file --to <number> --from <number> --url <url>'),
    'Send an MMS file message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending MMS file message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MMSFile({
      to: argv.to,
      from: argv.from,
      file: {
        url: argv.url,
        caption: argv.caption,
      },
      clientRef: argv.clientRef,
      webhookUrl: argv.webhookUrl,
      webhookVersion: argv.webhookVersion,
      ttl: argv.ttl,
    }),
  );
};
