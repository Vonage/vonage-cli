/* istanbul ignore file */
import { handler} from './conversations/list.js';
import { dumpCommand } from '../ux/dump.js';

export const command = 'conversations [command]';

export const desc = 'Manage conversations';

export const builder = (yargs) => yargs.commandDir('conversations')
  .epilogue(`When no command is given, ${dumpCommand('vonage conversations')} will act the same as ${dumpCommand('vonage conversations list')}. Run ${dumpCommand('vonage conversations list --help')} to see options.`);

export { handler };
