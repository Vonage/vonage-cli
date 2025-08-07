const [localeEnv] = process.env.LC_ALL?.split('.') || [];
const countries = require('../../data/countries.json');
const { printEmoji } = require('./printEmoji');

const resolvedLocale = localeEnv?.replace('_', '-') || 'en-US';
const localeObj = new Intl.Locale(resolvedLocale);
const region = localeObj.region || 'US';
const locale = localeObj.toString();

const countryCodes = Object.keys(countries);
const regionCurrencyCode = countries[region].currency || 'EUR';

/**
 * Returns a string with the country's flag emoji and its name.
 *
 * @param { string } countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns { string } - A string combining flag and country name.
 */
const buildCountryString = (countryCode) =>`${getCountryFlag(countryCode)}${getCountryName(countryCode)}`;

/**
 * Returns the emoji flag for the given country.
 *
 * @param { string } countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns { string } - The emoji representing the country's flag.
 */
const getCountryFlag = (countryCode) => printEmoji(countries[countryCode].emoji).trim();

/**
 * Returns the full name of the country.
 *
 * @param { string } countryCode - The ISO 3166-1 alpha-2 country code.
 * @returns { string } - The name of the country.
 */
const getCountryName = (countryCode) => countries[countryCode].name;

/**
 * Validates and coerces a country code to uppercase ISO 3166-1 alpha-2 format.
 *
 * @param { string } arg - The country code to validate.
 * @returns { string } - The uppercased and validated country code.
 * @throws { Error } - If the country code is invalid.
 */
const coerceCountry =  (arg) => {
  if (!countryCodes.includes(arg.toUpperCase())) {
    throw new Error(`Invalid country code: ${arg}`);
  }

  return arg.toUpperCase();
};

/**
 * @typedef { Object } CountryFlagOption
 * @property { string } describe - Description of the flag option.
 * @property { (arg: string) => string } coerce - Coercion function for validating country code.
 */

/** @type { CountryFlagOption } */
const countryFlag =  {
  describe: 'The country using the two character country code in ISO 3166-1 alpha-2 format',
  coerce: coerceCountry,
};

/**
 * Formats a date based on the user's locale.
 *
 * @param { string|Date } date - The date to format.
 * @returns { string|undefined } - The formatted date string or undefined if input is falsy.
 */
const displayDate = (date) => {
  if (!date) return undefined;
  return new Date(date).toLocaleString(locale);
};

/**
 * Formats a number as currency in EUR.
 *
 * @param { number|string } num - The number to format.
 * @param { string } [currencyCode=regionCurrencyCode] - Optional ISO 4217 currency code (e.g., 'USD', 'EUR').
 * @returns { string|undefined } - The formatted currency string or undefined if input is not a number.
 */
const displayCurrency = (num, currencyCode = regionCurrencyCode) => {
  const parsed = parseFloat(num);
  if (isNaN(parsed)) return undefined;
  return parsed.toLocaleString('en-GB', {
    style: 'currency',
    currency: currencyCode,
  });
};

module.exports = {
  displayCurrency,
  displayDate,
  countryFlag,
  coerceCountry,
  getCountryName,
  getCountryFlag,
  buildCountryString,
  countryCodes,
  locale,
  region,
  regionCurrencyCode,
};
