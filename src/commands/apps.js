/* istanbul ignore file */
import { handler} from './apps/list.js';
import { dumpCommand } from '../ux/dump.js';

export const command = 'apps [command]';

export const desc = 'Manage applications';

export const builder = (yargs) => yargs.commandDir('apps')
  .epilogue(`When no command is given, ${dumpCommand('vonage apps')} will act the same as ${dumpCommand('vonage apps list')}. Run ${dumpCommand('vonage apps list --help')} to see options.`);

export { handler };

