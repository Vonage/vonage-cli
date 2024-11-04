const { buildCountryString } = require('../utils/countries');
const { dumpValue } = require('../ux/dump');

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
  'Linked Application ID': number.appId || dumpValue('Not linked to any application'),
});

const displayFullNumber = (number = {}) => Object.assign({
  ...displayExtendedNumber(number),
  'Message Outbound HTTP URL': number.moHttpUrl,
  'Voice Callback': number.voiceCallback,
  'Voice Callback Value': number.voiceCallbackValue,
  'Voice Status Callback': number.voiceStatusCallback,
});

const displayExtendedNumbers = (numbers = []) => {
  const numbersToDisplay = numbers.map(displayExtendedNumber);
  console.table(numbersToDisplay);
};

const displayNumbers = (numbers = []) => {
  const numbersToDisplay = numbers.map(displayNumber);
  console.table(numbersToDisplay);
};

exports.displayFullNumber = displayFullNumber;

exports.displayExtendedNumbers = displayExtendedNumbers;

exports.displayExtendedNumber = displayExtendedNumber;

exports.displayNumber = displayNumber;

exports.displayNumbers = displayNumbers;

exports.typeLabels = typeLabels;

