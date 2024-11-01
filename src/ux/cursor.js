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

exports.hideCursor = hideCursor;
exports.resetCursor = resetCursor;
exports.exitAndShowCursor = exitAndShowCursor;

