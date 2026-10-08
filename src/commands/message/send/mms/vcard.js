import { MMSVcard } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import { mediaUrlOption, mmsCommonOptions, captionOption } from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'vcard';

export const desc = 'Send an MMS vCard message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': mediaUrlOption,
    'caption': captionOption,
    ...mmsCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send mms vcard --to <number> --from <number> --url <url>'),
    'Send an MMS vCard message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending MMS vCard message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MMSVcard({
      to: argv.to,
      from: argv.from,
      vcard: {
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
