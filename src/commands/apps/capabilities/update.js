import { dumpCommand } from '../../../ux/dump.js';
import { handler as messageHandler } from './update/messages.js';
import { handler as networkAapisHandler } from './update/networkApis.js';
import { handler as rtcHandler } from './update/rtc.js';
import { handler as verifyHandler } from './update/verify.js';
import { handler as videoHandler } from './update/video.js';
import { handler as voiceHandler } from './update/voice.js';

export const command = 'update <id> <which>';

export const description = 'Update application capabilities';

/* node:coverage disable */
export const builder = (yargs) => yargs.commandDir('update')
  .positional(
    'id',
    {
      type: 'string',
      describe: 'The application ID',
    },
  )
  .positional(
    'which',
    {
      type: 'string',
      describe: 'The capability to update',
      demandOption: true
    },
  )
  .example(
    dumpCommand('vonage apps capabilities update <id> <which>'),
    'Update an application capability',
  );
/* node:coverage enable */

export const handler = (argv) => {
  switch (argv.which) {
    case 'messages':
      return messageHandler(argv);

    case 'network_apis':
      return networkAapisHandler(argv);

    case 'rtc':
      return rtcHandler(argv);

    case 'verify':
      return verifyHandler(argv);

    case 'video':
      return videoHandler(argv);

    case 'voice':
      return voiceHandler(argv);
  }
};
