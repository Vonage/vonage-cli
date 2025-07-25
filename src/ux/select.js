const { inputFromTTY } = require('./input');
const { EOL } = require('os');
const { hideCursor, resetCursor } = require('./cursor');
const { clearPreviousLines } = require('./clear');

exports.select = async (
  {
    message,
    items,
    multiple = false,
    formatSelected = (option) => option,
    formatUnselected = (option) => option,
    formatHighlighted = (option) => option,
  } = {},
) => {
  process.stderr.write(`${message}${EOL}`);
  hideCursor();

  const printOption = ({option, selected, highlighted }) => {
    if (!selected && !highlighted) {
      process.stderr.write(`\r${formatUnselected(option)}${EOL}`);
      return;
    }

    let printStr = option;

    if (highlighted) {
      printStr = formatHighlighted(printStr);
    }

    if (selected) {
      printStr = formatSelected(printStr);
    }

    process.stderr.write(`\r${printStr}${EOL}`);
  };

  let selectedIndex = -1;

  const printOptions = (clear = false) => {
    if (clear) {
      clearPreviousLines(items.length);
    }

    for (const item of items ) {
      printOption(item);
    }
  };

  const getSelectedItem = () => items[selectedIndex] ? items[selectedIndex] : {};

  const toggleHighlight = (item) => item.highlighted = !item?.highlighted;

  const toggleSelected = (item) => item.selected =! item.selected;

  const resetSelected = () => items.forEach((item) => item.selected = false);

  const pressKey = (key) => {
    switch (key.name) {
    case 'up':
      toggleHighlight(getSelectedItem());
      selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
      toggleHighlight(getSelectedItem());
      break;

    case 'down':
      toggleHighlight(getSelectedItem());
      selectedIndex = selectedIndex < items.length ? selectedIndex + 1 : items.length;
      toggleHighlight(getSelectedItem());
      break;

    case 'space':
      !multiple && resetSelected();
      toggleSelected(getSelectedItem());

    }

    printOptions(true);
  };

  printOptions(false);
  await inputFromTTY({
    echo: false,
    onKeyPress: pressKey,
    onComplete: resetCursor,
  });

  resetCursor();
  const selectedItems = items.filter(({ selected }) => selected);
  clearPreviousLines(items.length + 2);

  process.stderr.write(`${selectedItems.map(({ option }) => option).join(', ')}${EOL}`);
  return selectedItems.map(({ option, value }) => ({ option, value}));
};
