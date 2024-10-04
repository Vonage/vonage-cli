const yargs = require('yargs');
const resetCursor = () => {
  process.stderr.write('\u001B[?25h');
};

const hideCursor = () => {
  process.stderr.write('\u001B[?25l');
};

const exitAndShowCursor = () => {
  resetCursor();
  yargs.exit(0);
};


process.on('exit', resetCursor);
process.on('SIGINT', exitAndShowCursor);
process.on('SIGTERM', exitAndShowCursor);
process.on('SIGQUIT', exitAndShowCursor);
process.on('SIGHUP', exitAndShowCursor);

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
    stop: () => {
      clearInterval(intervalId);
      process.stderr.write(`\r${endEmoji || ' '} ${message}\n`);
      resetCursor();
    },
    fail: () => {
      clearInterval(intervalId);
      process.stderr.write(`\r${failedEmoji || ' '} ${message}\n`);
      resetCursor();
    },
  };
};
