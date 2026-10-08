import { detectPlainOutput } from './detectScreenReader.js';
import parser from 'yargs-parser';
import { getSettings } from '../utils/settings.js';

const { emoji } = parser(process.argv);
const settings = getSettings();
const showEmoji = emoji ?? settings['emoji'] ?? !detectPlainOutput();

/**
  * Prints out an emoji unless plain output is set
  *
  * @param { string } emoji - The emoji to print
  * @return { string } - The emoji or empty string
  */
export const printEmoji = (emoji) => showEmoji ? emoji + ' ' : '';
