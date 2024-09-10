const { dumpKey, dumpValue } = require('./dump');

const descriptionTerm = (value) => dumpKey(value);

const descriptionDetails = (value) => dumpValue(value);

const descriptionList = (values) => (!Array.isArray(values)
  ? Object.entries(values)
  : values).map(
  ([term, details]) => `${descriptionTerm(term)}: ${descriptionDetails(details)}`,
).join('\n');

module.exports = {
  descriptionList,
  descriptionDetails,
  descriptionTerm,
};

