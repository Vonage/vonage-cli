const { printEmoji } = require('./printEmoji');
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
const dumpBoolean = ({value, trueWord = 'Yes', falseWord = 'No', includeText=false, noEmoji=false}) => value
  ? `${!noEmoji ? printEmoji('✅ ') : ''}${includeText ? trueWord : ''}`
  : `${!noEmoji ? printEmoji('❌ ') : ''}${includeText ? falseWord : ''}`;

exports.dumpBoolean = dumpBoolean;

/**
 * Formats a boolean value as "Yes" or "No", with optional emoji.
 *
 * @param { boolean } value - The value to display
 * @param { boolean } [includeText=true] - Whether to show the text label
 * @returns { string } - The formatted string
 */
exports.dumpYesNo = (value, includeText=true) => dumpBoolean({
  value: value,
  trueWord: 'Yes',
  falseWord: 'No',
  includeText: includeText,
});

/**
 * Formats a boolean value as "On" or "Off", without emoji.
 *
 * @param { boolean } value - The value to display
 * @returns { string } - The formatted string
 */
exports.dumpOnOff = (value) => dumpBoolean({
  value: value,
  trueWord: 'On',
  falseWord: 'Off',
  includeText: true,
  noEmoji: true,
});

/**
 * Formats a boolean value as "Enabled" or "Disabled", with optional emoji and optional label.
 *
 * @param { boolean } value - The value to display
 * @param { boolean } [includeText=false] - Whether to show the text label
 * @returns { string } - The formatted string
 */
exports.dumpEnabledDisabled = (value, includeText=false) => dumpBoolean({
  value: value,
  trueWord: 'Enabled',
  falseWord: 'Disabled',
  includeText: includeText,
});

/**
 * Formats a boolean value as "Valid" or "Invalid", with optional emoji and optional label.
 *
 * @param { boolean } value - The value to display
 * @param { boolean } [includeText=false] - Whether to show the text label
 * @returns { string } - The formatted string
 */
exports.dumpValidInvalid = (value, includeText=false) => dumpBoolean({
  value: value,
  trueWord: 'Valid',
  falseWord: 'Invalid',
  includeText: includeText,
});

/**
 * If value is truthy, displays the value string; otherwise, displays "Off".
 *
 * @param { string|boolean } value - The value to display
 * @returns { string } - The formatted string
 */
exports.dumpOffOrValue = (value) => dumpBoolean({
  value: value,
  trueWord: value,
  falseWord: 'Off',
  includeText: true,
  noEmoji: true,
});
