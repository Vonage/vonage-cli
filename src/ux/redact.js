import { getSettings } from '../utils/settings.js';
import parser from 'yargs-parser';

const { redact: redactParam } = parser(process.argv);
const { redact: redactSetting } = getSettings();

/**
 * Redacts text
 *
 * @param { string } text - The text to redact
 * @returns { string } - The redacted text
 */
export const redact = (text) => {
  if (!text) {
    return null;
  }

  if (!redactParam && redactSetting) {
    return `${text}`;
  }

  return `${text}`.substring(0, 3) + '*'.repeat(`${text}`.length - 2);
};
