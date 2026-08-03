let handlersRegistered = false;

const writeCursor = (sequence) => {
  if (process.stderr.isTTY) {
    process.stderr.write(sequence);
  }
};

const resetCursor = () => {
  writeCursor('\u001B[?25h');
};

const hideCursor = () => {
  if (!handlersRegistered) {
    process.on('exit', resetCursor);
    process.on('SIGINT', exitAndShowCursor);
    process.on('SIGTERM', exitAndShowCursor);
    process.on('SIGQUIT', exitAndShowCursor);
    process.on('SIGHUP', exitAndShowCursor);
    handlersRegistered = true;
  }

  writeCursor('\u001B[?25l');
};

const exitAndShowCursor = () => {
  resetCursor();
};

export { hideCursor };
export { resetCursor };
export { exitAndShowCursor };
