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
  const { detailFormatter } = options;
  if (value === undefined || value === null) {
    return detailFormatter('Not Set', term, value);
  }

  const varType = Array.isArray(value) ? 'array' : typeof value;

  switch (varType) {
  case 'bigint':
    // falls through
  case 'number':
    return detailFormatter(value.toString(), term, options);

  case 'array':
    return describeArray(value, options);

  case 'object':
    return describeObject(value, options);

  case 'string':
    // falls through
  default:
    return detailFormatter(value, term, options);
  }
};

/**
 * Returns a new options object with increased indentation.
 *
 * @param { Object } options - Current options.
 * @returns { Object } - Updated options with increased indent.
 */
const increaseIndent = ({indent, ...rest}) => ({
  ...rest,
  indent: Math.max(indent + 2, 0),
});

const decreseIndent = ({indent, ...rest}) => ({
  ...rest,
  indent: Math.max(indent - 2, 0),
});

const indentTerm = (term, options) => `${' '.repeat(options.indent)}${term}`;

/**
 * Formats object entries into description lines.
 *
 * @param { Object } data - The object to describe.
 * @param { Object } options - Formatting options.
 * @returns { string } - Array of formatted lines.
 */
const describeObject = (data, options) => [
  '{',
  EOL,
  ...Object.entries(data).map(
    ([term, detail]) => {
      if (detail === undefined || detail === null) {
        return `${indentTerm('', options)}${term}: ${descriptionDetail(detail, term, options)}`;
      }

      const varType = Array.isArray(detail) ? 'array' : typeof detail;
      switch (varType) {
      case 'object':
        return `${indentTerm(term, options)}: ${describeObject(
          detail,
          increaseIndent(options),
        )}`;

      case 'array':
        return `${indentTerm(term, options)}: ${describeArray(
          detail,
          increaseIndent(options),
        )}`;

      default:
        return `${indentTerm(term, options)}: ${descriptionDetail(detail, term, options)}`;
      }
    }).join(EOL),
  EOL,
  indentTerm('}', decreseIndent(options)),
].join('');

/**
 * Formats array items into description lines.
 *
 * @param { Array } data - The array to describe.
 * @param { Object } options - Formatting options.
 * @returns { string } - Array of formatted lines.
 */
const describeArray = (data, options) => [
  '[',
  EOL,
  ...data.map(
    (detail) => {
      if (detail === undefined || detail === null) {
        return `${indentTerm('', options)}${descriptionDetail(detail, '', options)}`;
      }

      const varType = Array.isArray(detail) ? 'array' : typeof detail;
      switch (varType) {
      case 'object':
        return `${indentTerm('', options)}${describeObject(
          detail,
          increaseIndent(options),
        )}`;

      case 'array':
        return `${indentTerm('', options)}${describeArray(
          detail,
          increaseIndent(options),
        )}`;

      default:
        return `${indentTerm('', options)}${descriptionDetail(detail, '', options)}`;
      }
    }).join(EOL),
  EOL,
  indentTerm(']', decreseIndent(options)),
].join('');

const defaults = {
  indent: 0,
  termFormatter: identity,
  detailFormatter: identity,
  padding: 2,
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

  return items.map(
    ({ term, detail}) => `${indentTerm(term)}: ${descriptionDetail(detail, term, options)}`,
  ).join(EOL);
};

module.exports = {
  descriptionList,
  descriptionDetail,
};
