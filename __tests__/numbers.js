import { faker } from '@faker-js/faker';
import { countryCodes } from '../src/ux/locale.js';

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

export { getTestPhoneNumber };
