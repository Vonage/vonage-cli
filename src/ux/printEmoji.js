const { detectPlainOutput } = require('./detectScreenReader');

const isPlain = detectPlainOutput();

/**
  * Prints out an emoji unless plain output is set
  *
  * @param { string } emoji - The emoji to print
  * @return { string } - The emoji or empty string
  */
exports.printEmoji = (emoji) => isPlain ? '' : emoji;
