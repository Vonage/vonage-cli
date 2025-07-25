const { detectPlainOutput } = require('./detectScreenReader');

exports.printEmoji = (emoji) => detectPlainOutput() ? '' : emoji;
