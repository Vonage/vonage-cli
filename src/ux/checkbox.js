import { select } from './select.js';
import { detectScreenReader } from './detectScreenReader.js';

const isReader = detectScreenReader();

const checkboxSelectedFormatter = (option) => isReader
  ? `Option ${option}, checked`
  : `☑ ${option}`;

const checkboxUnselectedFormatter = (option) => isReader
  ? `Option ${option}, unchecked`
  : `☐ ${option}`;

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
export const checkbox = ({
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

export { checkboxSelectedFormatter, checkboxUnselectedFormatter, checkboxHighlightedFormatter };
