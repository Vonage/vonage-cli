const { select } = require('./select');
const { detectScreenReader } = require('./detectScreenReader');

const isReader = detectScreenReader();

/**
 * Formats a selected checkbox option.
 *
 * @param { string } option - The option text to format
 * @returns { string } - The formatted option string
 */
const checkboxSelectedFormatter = (option) => isReader
  ? `Option ${option}, checked`
  : `☑ ${option}`;

/**
 * Formats an unselected checkbox option.
 *
 * @param { string } option - The option text to format
 * @returns { string } - The formatted option string
 */
const checkboxUnselectedFormatter = (option) => isReader
  ? `Option ${option}, unchecked`
  : `☐ ${option}`;

/**
 * Formats a highlighted checkbox option.
 *
 * @param { string } option - The option text to format
 * @returns { string } - The formatted option string
 */
const checkboxHighlightedFormatter = (option) => isReader
  ? `Option ${option}, selected`
  : `${option} ←`;


/**
 * @typedef { import('./select').SelectItem } SelectItem
 * @typedef { import('./select').SelectResult } SelectResult
 * @typedef { Object } CheckboxParams
 * @property { string } message - Prompt message
 * @property { Array<SelectItem> } items - Items to display
 * @property { Function } [formatSelected] - Formatter for selected items
 * @property { Function } [formatUnselected] - Formatter for unselected items
 * @property { Function } [formatHighlighted] - Formatter for highlighted item
 */

/**
 * Interactive checkbox prompt
 *
 * @param { CheckboxParams } options - Checkbox options
 * @returns { Promise<Array<SelectResult>> } - Selected options
 */
exports.checkbox = ({
  message,
  items,
  formatSelected = checkboxSelectedFormatter,
  formatUnselected = checkboxUnselectedFormatter,
  formatHighlighted = checkboxHighlightedFormatter,
}) => select({
  message,
  items,
  multiple: true,
  formatHighlighted,
  formatUnselected,
  formatSelected,
});

exports.checkboxSelectedFormatter = checkboxSelectedFormatter;
exports.checkboxUnselectedFormatter = checkboxUnselectedFormatter;
exports.checkboxHighlightedFormatter = checkboxHighlightedFormatter;
