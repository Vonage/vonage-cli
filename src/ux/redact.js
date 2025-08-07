/**
 * Redacts text
 *
 * @param { string } text - The text to redact
 * @returns { string } - The redacted text
 */
exports.redact = (text) => text
  ? `${text}`.substring(0, 3) + '*'.repeat(`${text}`.length - 2)
  : null;

