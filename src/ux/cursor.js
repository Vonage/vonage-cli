const CURSOR_SHOW = '\u001B[?25h';
const CURSOR_HIDE = '\u001B[?25l';

const resetCursor = () => {
  process.stderr.write(CURSOR_SHOW);
  process.stdout.write(CURSOR_SHOW);
};

const hideCursor = () => {
  process.stderr.write(CURSOR_HIDE);
  process.stdout.write(CURSOR_HIDE);
};

process.on('exit', resetCursor);
process.on('SIGINT', resetCursor);
process.on('SIGTERM', resetCursor);
process.on('SIGQUIT', resetCursor);
process.on('SIGHUP', resetCursor);

export { hideCursor, resetCursor };

