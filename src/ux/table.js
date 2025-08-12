const { detectPlainOutput, detectScreenReader } = require('./detectScreenReader');
const { descriptionList } = require('./descriptionList');
const { EOL } = require('os');

const isPlain = detectPlainOutput();
const isScreenReader = detectScreenReader();

/**
 * Custom error for invalid table rendering usage.
 */
class TableError extends Error {
  constructor(message, data) {
    super(message);
    this.name = 'TableError';
    this.data = data;
  }
}

/**
 * Default formatter for header cells.
 *
 * @param { string } key - The header key
 * @returns { string } - Formatted header text
 */
const defaultHeaderFormatter = (key) => key;

/**
 * Default formatter for data cells.
 *
 * @param { string } key - The field key
 * @param { any } value - The field value
 * @returns { string } - Formatted data text
 */
const defaultDataFormatter = (key, value) => String(value ?? '');

/**
 * @typedef { Object } BorderOptions
 * @property { string } [horizontal='─'] - Horizontal border character
 * @property { string } [vertical='│'] - Vertical border character
 */

/**
 * @typedef { Object } HeaderOptions
 * @property { BorderOptions } [borders] - Border Options
 * @property { boolean } [borderAbove] - Show border above header
 * @property { boolean } [borderBelow] - Show border below header
 */

/**
 * @typedef { Object } TableParams
 * @property { Array<Object> } data - Array of objects representing rows
 * @property { BorderOptions } [headerBorders] - Display options for the border
 * @property { BorderOptions } [dataBorders] - Display options for the border
 * @property { Function } [formatHeaderCell] - Formatter for header cells
 * @property { Function } [formatDataCell] - Formatter for data cells
 * @property { boolean } [isPlain] - Whether to render without borders
 */

const defaultBorders = {
  horizontal: '─',
  vertical: '',
};

/**
 * Renders a table in the terminal.
 *
 * @param { TableParams } options - Options for rendering the table
 * @returns { string } - Rendered table string
 * @throws { TableError } - If data is not a valid array
 */
const table = (
  data,
  {
    headerBorders = defaultBorders,
    dataBorders = defaultBorders,
    formatHeaderCell = defaultHeaderFormatter,
    formatDataCell = defaultDataFormatter,
  } = {},
) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new TableError('renderTable() requires `data` to be an array.', data);
  }

  if (isScreenReader) {
    [...data.map(descriptionList), EOL].join(EOL);
    return;
  }

  const headers = Object.keys(data[0]);
  const formattedHeaders = headers.map((header) => formatHeaderCell(header));

  const formattedRows = data.map((row) =>
    headers.map((k) => formatDataCell(k, row[k])),
  );

  const pad = (str, len) => str + ' '.repeat(len - str.length);

  // Column widths based on formatted content
  const colWidths = formattedHeaders.map((_, cellName) =>
    Math.max(
      formattedHeaders[cellName].length,
      ...formattedRows.map((row) => row[cellName].length),
    ),
  );

  const renderRow = (row, { vertical }) => {
    const content = row.map((cell, idx) => pad(cell, colWidths[idx]))
      .join(isPlain ? '  ' : ` ${vertical} `);

    return isPlain ? content : `${vertical} ${content} ${vertical}`;
  };

  const makeLine = (width, char, firstChar, lastChar) => [
    firstChar,
    char.repeat(width - (firstChar.length + lastChar.length)),
    lastChar,
  ].join('');

  const output = [];

  const outputRows = [
    renderRow(formattedHeaders, headerBorders),
    ...formattedRows.map((row) => renderRow(row, dataBorders)),
  ];

  const maxWidth = Math.max(...outputRows.map((row) => row.length));

  output.push(outputRows.shift());

  if (!isPlain) {
    output.push(makeLine(
      maxWidth,
      headerBorders.horizontal,
      headerBorders.horizontal,
      headerBorders.horizontal,
    ));
  }

  return [
    ...output,
    ...outputRows,
  ].join(EOL);
};

module.exports = {
  table,
  defaultHeaderFormatter,
  defaultDataFormatter,
  TableError,
  defaultBorders,
};
