import { MMSAudio } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import { mediaUrlOption, mmsCommonOptions, captionOption } from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'audio';

export const desc = 'Send an MMS audio message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': mediaUrlOption,
    'caption': captionOption,
    ...mmsCommonOptions,
  })
  .demandOption(['to', 'from', 'url'])
  .example(
    dumpCommand('vonage message send mms audio --to <number> --from <number> --url <url>'),
    'Send an MMS audio message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending MMS audio message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new MMSAudio({
      to: argv.to,
      from: argv.from,
      audio: {
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
