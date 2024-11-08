const { buildCountryString } = require('../utils/countries');
const { dumpValue } = require('../ux/dump');
const { displayCurrency } = require('../ux/currency');
const { typeLabels } = require('./types');

const displayNumber = (number = {}, fields = []) => Object.assign({
  'Number': number.msisdn,
  ...(fields.includes('country') ? {'Country': buildCountryString(number.country)} : {}),
  ...(fields.includes('type') ? {'Type': typeLabels[number.type]} : {}),
  ...(fields.includes('feature') ? {'Features': number.features.sort().join(', ')} : {}),
  ...(fields.includes('monthly_cost') ? {'Monthly Cost': displayCurrency(number.cost)} : {}),
  ...(fields.includes('setup_cost') ? {'Setup Cost': displayCurrency(number.initialPrice) } : {}),
  ...(fields.includes('app_id') ? {'Linked Application ID': number.appId || dumpValue('Not linked to any application') } : {}),
  ...(fields.includes('mo_outbound') ? {'Message Outbound HTTP URL': number.moHttpUrl} : {}),
  ...(fields.includes('voice_callback') ? {'Voice Callback': number.voiceCallback} : {}),
  ...(fields.includes('voice_callback_value') ? {'Voice Callback Value': number.voiceCallbackValue } : {}),
  ...(fields.includes('voice_status_callback') ? {'Voice Status Callback': number.voiceStatusCallback} : {}),
});

const displayNumbers = (numbers = [], fields = []) => {
  console.table(numbers.map((number) => displayNumber(
    number,
    fields,
  )));
};

exports.displayFullNumber = (number) => displayNumber(
  number,
  [
    'country',
    'type',
    'feature',
    'monthly_cost',
    'setup_cost',
    'app_id',
    'mo_outbound',
    'voice_callback',
    'voice_callback_value',
    'voice_status_callback',
  ]);

exports.displayNumber = displayNumber;

exports.displayNumbers = displayNumbers;

