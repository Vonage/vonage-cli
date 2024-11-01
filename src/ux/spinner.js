const { hideCursor, resetCursor } = require('./cursor');

const frames = [
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
  endEmoji = '✅',
  failedEmoji = '❌',
}) => {
  hideCursor();
  let counter = 0;
  process.stderr.write(`${frames[counter]} ${message}`);

  const intervalId = setInterval(() => {
    process.stderr.clearLine();
    process.stderr.write(`\r${frames[counter % 9]} ${message}`);
    counter++;
  }, 80);

  return {
    stop: (endMsg) => {
      clearInterval(intervalId);
      process.stderr.clearLine();
      process.stderr.write(endMsg
        ? `\r${endMsg}\n`
        : `\r${endEmoji || ''} ${message}\n`);
      resetCursor();
    },
    fail: (failMsg) => {
      clearInterval(intervalId);
      process.stderr.clearLine();
      process.stderr.write(failMsg
        ? `\r${failMsg}\n`
        : `\r${failedEmoji || ''} ${message}\n`);
      resetCursor();
    },
  };
};
