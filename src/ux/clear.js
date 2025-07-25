const readline = require('readline');
const CLEAR_SCREEN = '\x1b[2J\x1b[0;0H';

const clearSTDERR = () => {
  process.stderr.write(CLEAR_SCREEN);
};

const clearSTDIN = () => {
  process.stdin.write(CLEAR_SCREEN);
};

const clearScreen = () => {
  clearSTDIN();
  clearSTDERR();
};

const clearPreviousLines = (howMany) => {
  for (let i = 0; i < howMany; i++) {
    readline.moveCursor(process.stderr, 0, -1); // Move cursor up one line
    readline.clearLine(process.stderr, 0);      // Clear that line
  }
};

exports.clearSTDIN = clearSTDIN;
exports.clearSTDERR = clearSTDERR;
exports.clearScreen = clearScreen;
exports.clearPreviousLines = clearPreviousLines;
