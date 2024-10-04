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

exports.spinner = ({
  message,
  endEmoji,
  failedEmoji,
}) => {
  hideCursor();
  let counter = 0;
  process.stderr.write(`${message} ...`);

  const intervalId = setInterval(() => {
    process.stderr.clearLine();
    process.stderr.write(`\r${message} ${'.'.repeat(counter % 3 + 1)}`);
    counter++;
  }, 500);

  return {
    stop: () => {
      clearInterval(intervalId);
      process.stderr.write(`\r${message} ... Done! ${endEmoji || ''}\n`);
      resetCursor();
    },
    fail: () => {
      clearInterval(intervalId);
      process.stderr.write(`\r${message} ... Failed ${failedEmoji || ''}\n`);
      resetCursor();
    },
  };
};
