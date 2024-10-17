const { buildCountryString } = require('../utils/countries');

const typeLabels = {
  'landline': 'Landline',
  'landline-toll-free': 'Toll-free',
  'mobile-lvn': 'Mobile',
};

const displayNumber = (number = {}) => Object.assign({
  'Number': number.msisdn,
  'Country': buildCountryString(number.country),
  'Type': `${typeLabels[number.type]}`,
  'Features': number.features.sort().join(', '),
});

const displayExtendedNumber = (number = {}) => Object.assign({
  ...displayNumber(number),
  'Linked Application ID': number.appId,
  'Message Outbound HTTP URL': number.moHttpUrl,
  'Voice Callback': number.voiceCallback,
  'Voice Callback Value': number.voiceCallbackValue,
  'Voice Status Callback': number.voiceStatusCallback,
});

const displayNumbers = (numbers = []) => {
  const numbersToDisplay = numbers.map(displayNumber);
  console.table(numbersToDisplay);
};

exports.displayExtendedNumber = displayExtendedNumber;

exports.displayNumber = displayNumber;

exports.displayNumbers = displayNumbers;

exports.typeLabels = typeLabels;

