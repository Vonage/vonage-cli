const { inputFromTTY } = require('./input');
const { hideCursor, resetCursor } = require('./cursor');
const { clearPreviousLines, overwriteWithNewLine } = require('./clear');
const { detectScreenReader } = require('./detectScreenReader');

const isReader = detectScreenReader();

/**
 * Formats a selected option.
 * @param { string } option - The option text to format
 * @returns { string } - The formatted option string
 */
const selectedFormatter = (option) => isReader ? `${option}, selected` : `● ${option}`;

/**
 * Formats an unselected option.
 * @param { string } option - The option text to format
 * @returns { string } - The formatted option string
 */
const unselectedFormatter = (option) => isReader ? option : `○ ${option}`;

/**
 * Formats a highlighted option.
 * @param { string } option - The option text to format
 * @returns { string } - The formatted option string
 */
const highlightedFormatter = (option) => isReader ? `${option}, focused` : `${option} ←`;

/**
 * Custom error for invalid select() usage
 */
class SelectError extends Error {
  constructor(message, items) {
    super(message);
    this.name = 'SelectError';
    this.items = items;
  }
}

/**
 * @typedef { Object } SelectItem
 * @property { string } option - The display text for the option
 * @property { any } value - The value associated with the option
 * @property { boolean } [selected] - Whether the option is currently selected
 * @property { boolean } [highlighted] - Whether the option is currently highlighted
 */

/**
 * @typedef { Object } SelectParams
 * @property { string } message - Prompt message
 * @property { Array<SelectItem> } items - Items to display
 * @property { boolean } [multiple=false] - Allow multiple selections
 * @property { boolean } [clearOnComplete=false] - Clear the screen after completing
 * @property { Function } [formatSelected] - Formatter for selected items
 * @property { Function } [formatUnselected] - Formatter for unselected items
 * @property { Function } [formatHighlighted] - Formatter for highlighted item
 */

/**
 * @typedef { Object } SelectResult
 * @property { string } option - The display text for the selected option
 * @property { any } value - The value associated with the selected option
 */

/**
 * Interactive selection prompt
 *
 * @param { SelectParams } options - Selection options
 * @returns { Promise<Array<SelectResult>> } - Selected options
 */
exports.select = async (
  {
    message,
    items,
    multiple = false,
    clearOnComplete = false,
    formatSelected = selectedFormatter,
    formatUnselected = unselectedFormatter,
    formatHighlighted = highlightedFormatter,
  } = {},
) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new SelectError('select() requires a non-empty items array.', items);
  }

  let showHelp = false;

  overwriteWithNewLine(message);
  hideCursor();

  const printOption = ({ option, value, selected, highlighted }) => {
    let printStr = selected
      ? formatSelected(option, value)
      : formatUnselected(option, value);

    if (highlighted) {
      printStr = formatHighlighted(printStr, value);
    }

    overwriteWithNewLine(printStr);
  };

  let selectedIndex = 0;
  let printedLineCount = 0;
  items[selectedIndex].highlighted = true;

  const printOptions = (clear = false) => {
    if (clear) {
      clearPreviousLines(printedLineCount);
      printedLineCount = 0;
    }

    for (const item of items) {
      printedLineCount++;
      printOption(item);
    }

    printHelp();
  };

  const printHelp = () => {
    overwriteWithNewLine('');
    printedLineCount++;
    if (!showHelp) {
      overwriteWithNewLine('Press ? for help with controls');
      printedLineCount++;
      return;
    }

    overwriteWithNewLine('Use the cursor keys to move up and down');
    overwriteWithNewLine('Press space to select or deselect');
    overwriteWithNewLine('Press enter when complete');
    printedLineCount += 3;
  };

  const getSelectedItem = () => items[selectedIndex] ? items[selectedIndex] : {};

  const toggleHighlight = (item) => item.highlighted = !item?.highlighted;

  const toggleSelected = (item) => item.selected = !item.selected;

  const resetSelected = () => items.forEach((item) => item.selected = false);

  const pressKey = (key) => {
    switch (key.name) {
    case 'k':
    case 'up':
      toggleHighlight(getSelectedItem());
      selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
      toggleHighlight(getSelectedItem());
      break;

    case 'j':
    case 'down':
      toggleHighlight(getSelectedItem());
      selectedIndex = selectedIndex < items.length - 1
        ? selectedIndex + 1
        : items.length - 1;
      toggleHighlight(getSelectedItem());
      break;

    case 'space':
      !multiple && resetSelected();
      toggleSelected(getSelectedItem());
    }

    if (key.sequence === '?') {
      showHelp = !showHelp;
    }

    printOptions(true);
  };

  printOptions(false);
  await inputFromTTY({
    echo: false,
    onKeyPress: pressKey,
    onReminder: () => printOptions(true),
  });

  resetCursor();
  if (clearOnComplete) {
    clearPreviousLines(items.length + 2);
  }

  return items.filter(({ selected }) => selected)
    .map(({ option, value }) => ({ option, value }));
};

exports.formatSelected = selectedFormatter;
exports.formatUnselected = unselectedFormatter;
exports.formatHighlighted = highlightedFormatter;
exports.SelectError = SelectError;
