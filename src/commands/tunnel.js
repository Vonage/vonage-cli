import { dumpCommand } from '../ux/dump.js';

/* istanbul ignore file */
export const command = 'tunnel <which>';

export const desc = 'Open a tunnel in order to test webhooks';

export const builder = (yargs) => yargs.commandDir('tunnel')
  .example(
    dumpCommand('vonage tunnel ngrok <id>'),
    'Open an ngrok tunnel for an application',
  );

export const handler = () => { };
