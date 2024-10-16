const { buildCountryString } = require('../utils/countries');

const typeLabels = {
  'landline': 'Landline',
  'landline-toll-free': 'Toll-free',
  'mobile-lvn': 'Mobile',
};

const displayNumbers = (numbers = []) => {
  const numbersToDisplay = numbers.map((number) => {
    return {
      'Number': number.msisdn,
      'Country': buildCountryString(number.country),
      'Type': `${typeLabels[number.type]}`,
      'Features': number.features.sort().join(', '),
    };
  });
  console.table(numbersToDisplay);
};

exports.displayNumbers = displayNumbers;

exports.typeLabels = typeLabels;

