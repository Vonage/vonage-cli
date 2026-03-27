import { printEmoji } from './printEmoji.js';

/**
 * @typedef { Object } DumpBooleanOptions
 * @property { boolean } value - The boolean value to format
 * @property { string } [trueWord='Yes'] - Text to display when true
 * @property { string } [falseWord='No'] - Text to display when false
 * @property { boolean } [includeText=false] - Whether to include the text label
 * @property { boolean } [noEmoji=false] - Whether to omit emoji
 */

/**
 * Formats a boolean value into a decorated string with optional emoji and label text.
 *
 * @param { DumpBooleanOptions } options
 * @returns { string } - The formatted string
 */
const dumpBoolean = ({ value, trueWord = 'Yes', falseWord = 'No', includeText = false, noEmoji = false }) => value
  ? `${!noEmoji ? printEmoji('✅') : ''}${includeText ? trueWord : ''}`
  : `${!noEmoji ? printEmoji('❌') : ''}${includeText ? falseWord : ''}`;

export { dumpBoolean };

/**
 * Creates a boolean formatter function with preset words and display options.
 *
 * @param { string } trueWord - Text when true
 * @param { string } falseWord - Text when false
 * @param { boolean } [includeText=false] - Whether to show the label
 * @param { boolean } [noEmoji=false] - Whether to omit emoji
 * @returns { Function } - A (value, includeText?) => string formatter
 */
const createBooleanFormatter = (trueWord, falseWord, includeText = false, noEmoji = false) =>
  (value, overrideIncludeText = includeText) =>
    dumpBoolean({ value, trueWord, falseWord, includeText: overrideIncludeText, noEmoji });

/**
 * Formats a boolean value as "Yes" or "No", with optional emoji.
 *
 * @param { boolean } value - The value to display
 * @param { boolean } [includeText=true] - Whether to show the text label
 * @returns { string } - The formatted string
 */
export const dumpYesNo = createBooleanFormatter('Yes', 'No', true);

/**
 * Formats a boolean value as "On" or "Off", without emoji.
 *
 * @param { boolean } value - The value to display
 * @returns { string } - The formatted string
 */
export const dumpOnOff = createBooleanFormatter('On', 'Off', true, true);

/**
 * Formats a boolean value as "Enabled" or "Disabled", with optional emoji and optional label.
 *
 * @param { boolean } value - The value to display
 * @param { boolean } [includeText=false] - Whether to show the text label
 * @returns { string } - The formatted string
 */
export const dumpEnabledDisabled = createBooleanFormatter('Enabled', 'Disabled');

/**
 * Formats a boolean value as "Valid" or "Invalid", with optional emoji and optional label.
 *
 * @param { boolean } value - The value to display
 * @param { boolean } [includeText=false] - Whether to show the text label
 * @returns { string } - The formatted string
 */
export const dumpValidInvalid = createBooleanFormatter('Valid', 'Invalid');

/**
 * If value is truthy, displays the value string; otherwise, displays "Off".
 *
 * @param { string|boolean } value - The value to display
 * @returns { string } - The formatted string
 */
export const dumpOffOrValue = (value) => dumpBoolean({
  value,
  trueWord: value,
  falseWord: 'Off',
  includeText: true,
  noEmoji: true,
});
