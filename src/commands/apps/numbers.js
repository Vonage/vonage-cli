/* istanbul ignore file */
import { handler } from './numbers/list.js';

export const command = 'numbers <command>';

export const desc = 'Manage application numbers';

export const builder = (yargs) => yargs.commandDir('numbers');

export { handler };

