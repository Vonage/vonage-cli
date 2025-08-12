const { faker } = require('@faker-js/faker');
const { countryCodes } = require('../src/ux/locale');

const getTestPhoneNumber = () => Object.freeze({
  'country': faker.helpers.shuffle(countryCodes)[0],
  'msisdn': faker.phone.number({ style: 'international' }),
  'type': faker.helpers.shuffle(['landline', 'landline-toll-free', 'mobile-lvn'])[0],
  'features': faker.helpers.arrayElements([
    'VOICE',
    'MMS',
    'SMS',
  ], {min: 1, max: 3}).sort(),
});

exports.getTestPhoneNumber = getTestPhoneNumber;
