/* istanbul ignore file */
import { handler} from './users/list.js';
import { dumpCommand } from '../ux/dump.js';

export const command = 'users [command]';

export const desc = 'Manage users';

export const builder = (yargs) => yargs.commandDir('users')
  .epilogue(`When no command is given, ${dumpCommand('vonage users')} will act the same as ${dumpCommand('vonage users list')}. Run ${dumpCommand('vonage users list --help')} to see options.`);

export { handler };

