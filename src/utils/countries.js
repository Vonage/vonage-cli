const countries = require('../../data/countries.json');

const countryCodes = Object.keys(countries);

const buildCountryString = (countryCode) =>`${getCountryFlag(countryCode)} ${getCountryName(countryCode)}`;

const getCountryFlag = (countryCode) => countries[countryCode].emoji.trim();

const getCountryName = (countryCode) => countries[countryCode].name;

exports.countries = countries;

exports.countryCodes = countryCodes;

exports.getCountryFlag = getCountryFlag;

exports.getCountryName = getCountryName;

exports.buildCountryString = buildCountryString;
