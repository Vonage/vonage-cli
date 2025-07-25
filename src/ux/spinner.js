const { hideCursor, resetCursor } = require('./cursor');
const { EOL } = require('os');
const { detectPlainOutput, getReplayRate } = require('./detectScreenReader');
const { truncateToTerminal } = require('./truncateToTerminal');
const { printEmoji } = require('./printEmoji');
const { cursorTo, clearLine} = require('readline');

const defaultFrames = [
  '⠋',
  '⠙',
  '⠹',
  '⠸',
  '⠼',
  '⠴',
  '⠦',
  '⠧',
  '⠇',
  '⠏',
];

exports.spinner = ({
  message,
  frames = defaultFrames,
  frameRate = 80,
  endEmoji = '✅',
  failedEmoji = '❌',
}) => {
  let counter = 0;
  const frameLength = frames.length;
  if (detectPlainOutput()) {
    process.stderr.write(`${message}${EOL}`);
    frameRate = getReplayRate();
  } else {
    hideCursor();
    process.stderr.write(`${frames[counter]} ${message}`);
  }

  const intervalId = setInterval(() => {
    if (detectPlainOutput()) {
      process.stderr.write(`${message}${EOL}`);
      return;
    }
    clearLine(process.stderr);
    cursorTo(process.stderr, 0);

    process.stderr.write(`${frames[counter % frameLength]} ${truncateToTerminal(message)}`);
    counter++;
  }, frameRate);

  const end = (endMsg) => {
    clearInterval(intervalId);
    process.stderr.clearLine();
    process.stderr.write(
      `\r${endMsg || message}${EOL}`,
    );
    resetCursor();
  };

  return {
    stop: (endMsg) => {end(endMsg
        ? `\r${endMsg}${EOL}`
        : `\r${printEmoji(endEmoji)} ${message}${EOL}`)},
    fail: (failMsg) => {end(failMsg
        ? `\r${failMsg}${EOL}`
        : `\r${printEmoji(failedEmoji)} ${message}${EOL}`)},
  };
};
