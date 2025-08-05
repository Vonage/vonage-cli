const { EOL } = require('os');
const readline = require('readline');
const CLEAR_SCREEN = '\x1b[2J\x1b[0;0H';

/**
 * Clear the entire screen and reset the cursor.
 */
const clearScreen = (stream = process.stderr) => stream.write(CLEAR_SCREEN);

/**
 * Clear a number of previous lines.
 *
 * @param { number } howMany - Number of lines to clear
 * @param { stream.Writable } [stream=process.stderr] - Stream to write to
 */
const clearPreviousLines = (howMany, stream = process.stderr) => {
  for (let i = 0; i < howMany; i++) {
    readline.moveCursor(stream, 0, -1);
    readline.clearLine(stream, 0);
  }
};

/**
 * Clears the current line and writes a string in place.
 *
 * @param { string } str - The string to print
 * @param { stream.Writable } [stream=process.stderr] - Stream to write to
 */
const overwriteLine = (str, stream = process.stderr) => stream.write(`\r\x1b[2K${str}`);

/**
 * Clears the current line, writes a string, and moves to a new line.
 *
 * @param { string } str - The string to print
 * @param { stream.Writable } [stream=process.stderr] - Stream to write to
 */
const overwriteWithNewLine = (str, stream = process.stderr) => (
  overwriteLine(str, stream),
  stream.write(EOL)
);

exports.overwriteLine = overwriteLine;
exports.overwriteWithNewLine = overwriteWithNewLine;
exports.clearScreen = clearScreen;
exports.clearPreviousLines = clearPreviousLines;
