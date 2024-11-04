const countries = require('../../data/countries.json');

const countryCodes = Object.keys(countries);

const buildCountryString = (countryCode) =>`${getCountryFlag(countryCode)} ${getCountryName(countryCode)}`;

const getCountryFlag = (countryCode) => countries[countryCode].emoji.trim();

const getCountryName = (countryCode) => countries[countryCode].name;

const coerceCountry =  (arg) => {
  if (!countryCodes.includes(arg.toUpperCase())) {
    throw new Error(`Invalid country code: ${arg}`);
  }

  return arg.toUpperCase();
};

const countryFlag =  {
  describe: 'The country using the two character country code in ISO 3166-1 alpha-2 format',
  coerce: coerceCountry,
};
exports.countries = countries;

exports.countryCodes = countryCodes;

exports.getCountryFlag = getCountryFlag;

exports.getCountryName = getCountryName;

exports.buildCountryString = buildCountryString;

exports.coerceCountry = coerceCountry;

exports.countryFlag = countryFlag;
