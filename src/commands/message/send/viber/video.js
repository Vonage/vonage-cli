import { ViberVideo } from '@vonage/messages';
import { dumpCommand } from '../../../../ux/dump.js';
import {
  buildViberMessage,
  buildViberService,
  viberCommonOptions,
  viberMediaUrlOption,
  viberServiceOptions,
} from './common.js';
import { sendMessage } from '../../../../messageFlags.js';

export const command = 'video';

export const desc = 'Send a Viber video message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'url': viberMediaUrlOption,
    'caption': {
      describe: 'Optional caption for the video',
      type: 'string',
      group: 'Viber Message',
    },
    'thumb-url': {
      describe: 'Optional thumbnail URL for the video',
      type: 'string',
      group: 'Viber Message',
      coerce: viberMediaUrlOption.coerce,
    },
    'duration': {
      describe: 'The video duration in seconds',
      type: 'string',
      group: 'Viber Message',
    },
    'file-size': {
      describe: 'The video file size in MB',
      type: 'string',
      group: 'Viber Message',
    },
    ...viberCommonOptions,
    ...viberServiceOptions,
  })
  .demandOption(['to', 'from', 'url', 'ttl', 'viber-type', 'category', 'action-url', 'action-text', 'duration', 'file-size'])
  .example(
    dumpCommand('vonage message send viber video --to <number> --from <sender> --url <url> --duration <seconds> --file-size <mb> --ttl <seconds> --viber-type <type> --category <category> --action-url <url> --action-text <text>'),
    'Send a Viber video message',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  console.info(`Sending Viber video message to ${argv.to}`);

  await sendMessage(
    argv.SDK,
    new ViberVideo({
      ...buildViberMessage(argv),
      video: {
        url: argv.url,
        caption: argv.caption,
        thumbUrl: argv.thumbUrl,
      },
      viberService: buildViberService(argv, {
        duration: argv.duration,
        fileSize: argv.fileSize,
      }),
    }),
  );
};
