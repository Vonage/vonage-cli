const { getTerminalWidth } = require('./getTerminalWidth');

/**
 * Truncates a message so that the full line fits within the terminal width.
 * Adds an ellipsis (…) if truncation occurs.
 *
 * @param {string} message - The message prefix to be trimmed if needed.
 * @param {number} [terminalWidth=process.stderr.columns || 80] - Width of the terminal.
 * @param {number} [reservedWidth=0] - Width of content printed after the message.
 * @returns {string} - Trimmed message that fits.
 */
exports.truncateToTerminal = (
  message,
  reservedWidth = 0,
) => {
  const maxMessageLength = getTerminalWidth() - reservedWidth - 1;
  if (message.length <= maxMessageLength) {
    return message;
  }

  return maxMessageLength > 1
    ? message.slice(0, maxMessageLength - 1) + '…'
    : '';
};
