const resetCursor = () => {
  process.stderr.write('\u001B[?25h');
  process.stdout.write('\u001B[?25h');
  process.off('exit', resetCursor);
};

const hideCursor = () => {
  process.stderr.write('\u001B[?25l');
  process.stdout.write('\u001B[?25l');
  process.off('exit', resetCursor);
  process.on('exit', resetCursor);
};

const exitAndShowCursor = () => {
  resetCursor();
};


process.on('SIGINT', exitAndShowCursor);
process.on('SIGTERM', exitAndShowCursor);
process.on('SIGQUIT', exitAndShowCursor);
process.on('SIGHUP', exitAndShowCursor);

export { hideCursor };
export { resetCursor };
export { exitAndShowCursor };

