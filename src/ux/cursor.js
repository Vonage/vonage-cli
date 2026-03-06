const resetCursor = () => {
  process.stderr.write('\u001B[?25h');
  process.stdout.write('\u001B[?25h');
};

const hideCursor = () => {
  process.stderr.write('\u001B[?25l');
  process.stdout.write('\u001B[?25l');
};

const exitAndShowCursor = () => {
  resetCursor();
};


process.on('exit', resetCursor);
process.on('SIGINT', exitAndShowCursor);
process.on('SIGTERM', exitAndShowCursor);
process.on('SIGQUIT', exitAndShowCursor);
process.on('SIGHUP', exitAndShowCursor);

export { hideCursor };
export { resetCursor };
export { exitAndShowCursor };

