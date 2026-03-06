/* istanbul ignore file */
import { handler} from './members/list.js';
import { dumpCommand } from '../ux/dump.js';

export const command = 'members [command]';

export const desc = 'Manage applications';

export const builder = (yargs) => yargs.commandDir('members')
  .epilogue(`When no command is given, ${dumpCommand('vonage members')} will act the same as ${dumpCommand('vonage members list')}. Run ${dumpCommand('vonage members list --help')} to see options.`);

export { handler };
