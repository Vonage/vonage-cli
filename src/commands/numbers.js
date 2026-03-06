/* istanbul ignore file */
import { handler} from './numbers/list.js';
import { dumpCommand } from '../ux/dump.js';

export const command = 'numbers [command]';

export const desc = 'Manage numbers';

export const builder = (yargs) => yargs.commandDir('numbers')
  .epilogue(`When no command is given, ${dumpCommand('vonage numbers')} will act the same as ${dumpCommand('vonage numbers list')}. Run ${dumpCommand('vonage numbers list --help')} to see options.`);

export { handler };
