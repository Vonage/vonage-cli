const { getTerminalWidth } = require('./getTerminalWidth');
const { EOL } = require('os');

const identity = (x) => x;

/**
 * Recursively formats detail values for description list.
 *
 * @param { * } value - The value to describe.
 * @param { string } term - The associated term key.
 * @param { Object } options - Formatting options.
 * @returns { string } - Formatted detail string.
 */
const descriptionDetail = (value, term, options) => {
  const varType = Array.isArray(value) ? 'array' : typeof value;

  if (value === undefined || value === null) {
    return options.detailFormatter('-', term, value);
  }

  switch (varType) {
  case 'bigint':
    // falls through
  case 'number':
    return options.detailFormatter(value.toString(), term, options);

  case 'array':
    return [
      ...(!options.recursive ? ['['] : [EOL]),
      describeArray(value, increaseIndent(options)).join(options.recursive ? EOL : ','),
      ...(!options.recursive ? [' ]'] : [EOL]),
    ].join('');

  case 'object':
    return [
      ...(!options.recursive ? ['{'] : [EOL]),
      describeObject(value, increaseIndent(options)).join(options.recursive ? EOL : ','),
      ...(!options.recursive ? [' }'] : [EOL]),
    ].join('');

  case 'string':
    // falls through
  default:
    return options.detailFormatter(value, term, options);
  }
};

/**
 * Returns a new options object with increased indentation.
 *
 * @param { Object } options - Current options.
 * @returns { Object } - Updated options with increased indent.
 */
const increaseIndent = (options) => ({
  ...options,
  indent: Math.max(options.indent + (options.recursive ? 2 : -2 ), 0),
});

/**
 * Formats object entries into description lines.
 *
 * @param { Object } data - The object to describe.
 * @param { Object } options - Formatting options.
 * @returns { string[] } - Array of formatted lines.
 */
const describeObject = (data, options) =>  Object.entries(data).map(
  ([term, detail]) => {
    if (detail === undefined || detail === null) {
      return ` ${' '.repeat(options.indent)}${term} ${descriptionDetail(detail, term, options)}`;
    }

    const indent = options.recursive ? options.indent : 0;

    const varType = Array.isArray(detail) ? 'array' : typeof detail;
    switch (varType) {
    case 'object':
      return ` ${' '.repeat(indent)}${term} ${descriptionDetail(
        detail,
        term,
        increaseIndent(options),
      )}`;

    case 'array':
      return ` ${' '.repeat(indent)}${options.recursive ?  term : ''}: ${descriptionDetail(
        detail,
        term,
        increaseIndent(options),
      )}`;

    default:
      return ` ${' '.repeat(options.indent)}${Array.isArray(data) ? '' : term} ${descriptionDetail(detail, term, options)}`;
    }
  }).slice(0, !options.recursive ? options.numKeys : undefined);

/**
 * Formats array items into description lines.
 *
 * @param { Array } data - The array to describe.
 * @param { Object } options - Formatting options.
 * @returns { string[] } - Array of formatted lines.
 */
const describeArray = (data, options) => data.map(
  (detail, term) => {
    if (detail === undefined || detail === null) {
      return ` ${' '.repeat(options.indent)}${term} ${descriptionDetail(detail, term, options)}`;
    }

    const indent = options.recursive ? options.indent : 0;

    const varType = Array.isArray(detail) ? 'array' : typeof detail;
    switch (varType) {
    case 'object':
      return ` ${' '.repeat(indent)} ${descriptionDetail(
        detail,
        term,
        increaseIndent(options),
      )}`;

    case 'array':
      return ` ${' '.repeat(indent)} ${descriptionDetail(
        detail,
        term,
        increaseIndent(options),
      )}`;

    default:
      return ` ${' '.repeat(options.indent)} ${descriptionDetail(detail, term, options)}`;
    }
  }).slice(0, !options.recursive ? options.numKeys : undefined);

const defaults = {
  indent: 0,
  termFormatter: identity,
  detailFormatter: identity,
  padding: 2,
  recursive: true,
  numKeys: 3,
};

/**
 * Displays complex data as a description list
 *
 * @param Array|Object items - A list of items.
 */
const descriptionList = (
  items,
  options = defaults,
) => {
  options = {
    ...defaults,
    ...options,
  };
  const { termFormatter, padding, indent } =  options;

  // process items
  const { processedItems, maxTermLength } = (!Array.isArray(items)
    ? Object.entries(items)
    : items).reduce(
    (acc, [ term, detail ]) => {
      const resolvedItem = {
        term: termFormatter(String(term)),
        detail: detail,
      };

      acc.processedItems.push(resolvedItem);
      acc.maxTermLength = Math.max(
        acc.maxTermLength,
        String(resolvedItem.term).length,
      );
      return acc;
    },
    { processedItems: [], maxTermLength: 0},
  );

  const termWidth = Math.min(maxTermLength + padding, Math.floor(getTerminalWidth() / 2));

  return processedItems.map(
    ({ term, detail}) => [
      ' '.repeat(indent),
      term,
      ' '.repeat(Math.max(termWidth - term.length, 1)),
      descriptionDetail(detail, term, options),
    ].join(''),
  ).join(EOL);
};

module.exports = {
  descriptionList,
  descriptionDetail,
};
