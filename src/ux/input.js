const { overwriteLine } = require('./clear');
const readline = require('readline');

// ANSI: CSI, OSC (incl. hyperlinks), and 2-byte ESC sequences
// eslint-disable-next-line no-control-regex
const ANSI_PATTERN = /\u001B(?:\[[0-?]*[ -/]*[@-~]|\][^\u0007]*?(?:\u0007|\u001B\\)|[@-Z\\-_])/g;

// Remove Unicode control (Cc) + format (Cf) chars.
// Keep \n\r\t by default; override via { keep: "" } to drop everything.
const stripUnicodeControlsAndFormats = (str, { keep = '\n\r\t' } = {}) => {
  if (!str) {
    return str;
  }

  const keepSet = new Set(keep.split(''));
  return str.replace(/[\p{Cc}\p{Cf}]/gu, (char) => (keepSet.has(char) ? char : ''));
};

// Combined sanitizer for text coming from terminal
const stripChalkInput = (str, { keep = '' } = {}) => {
  if (!str) {
    return str;
  }

  return stripUnicodeControlsAndFormats(str.replace(ANSI_PATTERN, ''), { keep });
};

const setRawMode = () => {
  try {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
  } catch (err) {
    console.error(`Attempted to start raw mode for STDIN failed with error: ${err.message}`);
    console.error('');
    console.error('Please report this error to GitHub: https://github.com/vonage/vonage-cli');
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

/**
 * Callback invoked on each key press.
 * @callback onKeyPress
 * @param { Key } key - Data about the key
 * @param { string } str - The string characters pressed during input
 * @returns { void }
 */

/**
 * Callback invoked when input is complete.
 * @callback onComplete
 * @param { string } str - A string of all the string characters pressed
 * @returns { void }
 */

/**
 * Callback invoked after the reminder message has been printed
 * @callback onReminder
 * @param { string[] } keysPressed - An array of characters containing all the printable characters pressed
 * @returns { void }
 */

/**
 * @typedef { object } InputParams
 * @property { string } [message] - Printable message
 * @property { string } [reminderMessage] - Optional reminder message (defaults to message)
 * @property { number } [reminderInterval] - How often to print the reminder message (defaults to 5000)
 * @property { boolean } [echo] - Whether to echo the typed characters
 * @property { string } [value] - A value to prefill
 * @property { string } [hint] - Provide a hint for the correct value
 * @property { AbortSignal } [signal] - Abort controller
 * @property { number } [length] - How many key presses to accept before resolving
 * @property { onKeyPress } [onKeyPress] - Optional keypress function
 * @property { onComplete } [onComplete] - Optional completed function
 * @property { onReminder } [onReminder] - Optional reminder function
 */

/**
 * Accept input from the terminal
 *
 * This will continue to listen for keypress events until either the return key
 * is pressed, or the number of printable characters has reached the length.
 *
 * @param { InputParams } params for the function
 * @returns { Promise }
 */
const inputFromTTY = (
  {
    message = null,
    reminderMessage = null,
    reminderInterval = 5000,
    echo = true,
    value,
    hint,
    signal,
    length,
    onKeyPress = () => { },
    onComplete = () => { },
    onReminder = () => { },
  } = {},
) => new Promise((resolve, reject) => {
  let done = false;
  let intervalId;
  let rl;
  let handlePress;
  let keysPressed = value ? String(value).split('') : [];

  reminderMessage = reminderMessage ?? message;

  const printMessageAndKeys = () => reminderMessage
    && overwriteLine(`${reminderMessage} ${hint && keysPressed.join('').length < 1 ? hint + ' ' : ''}${echo ? keysPressed.join('') : ''}`);

  const restartReminder = () => {
    if (!reminderMessage) {
      return;
    }

    clearInterval(intervalId);
    intervalId = setInterval(
      () => {
        printMessageAndKeys();
        onReminder(keysPressed);
      },
      reminderInterval,
    );
  };

  // Cleanup and resolve
  const finish = (err, value) => {
    if (done) {
      return;
    }

    done = true;
    cleanup();
    err ? reject(err) : resolve(value);
  };

  // Clean up on signal abort
  const onAbort = () => {
    signal?.removeEventListener('abort', onAbort);
    finish(signal?.reason);
  };

  // Signal Handles control signals. This will exit and kill
  const handleSignal = (signal) => {
    switch (signal) {
    case 'SIGINT':
      cleanup();
      // eslint-disable-next-line n/no-process-exit
      process.exit(130);
      break;

    case 'SIGQUIT':
      cleanup();
      // eslint-disable-next-line n/no-process-exit
      process.exit(131);
      break;

    case 'SIGTSTP':
      cleanup();
      process.kill(process.pid, 'SIGTSTP'); // Allow OS to suspend the process
      break;
    }
  };

  // Handle signals globally
  const onSigint = () => handleSignal('SIGINT');
  const onSigquit = () => handleSignal('SIGQUIT');
  const onSigtstp = () => handleSignal('SIGTSTP');

  // Cleanup registered listeners
  const cleanup = () => {
    clearInterval(intervalId);

    process.off('SIGINT', onSigint);
    process.off('SIGQUIT', onSigquit);
    process.off('SIGTSTP', onSigtstp);

    // remove abort listener if still attached
    signal?.removeEventListener?.('abort', onAbort);

    if (rl) {
      handlePress && rl?.input?.off('keypress', handlePress);
      rl.off('close', cleanup);

      try {
        rl.close();
      } catch (err) {
        console.warn(`Attempted to close readline threw an error ${err.message}`);
        console.warn('');
        console.warn('Please report this error to GitHub: https://github.com/vonage/vonage-cli');
      }
    }

    // restore raw mode if we set it
    if (process.stdin.isTTY) {
      try {
        process.stdin.setRawMode(false);
      } catch (err) {
        console.warn(`Turning off raw mode for STDIN failed with message ${err.message}`);
        console.warn('');
        console.warn('Please report this error to GitHub: https://github.com/vonage/vonage-cli');
      }
    }
  };

  process.on('SIGINT', onSigint);
  process.on('SIGQUIT', onSigquit);
  process.on('SIGTSTP', onSigtstp);

  // Allow signal controller to abort
  if (signal?.aborted) {
    finish(signal.reason);
    return;
  }

  // Cleanup on abort
  signal?.addEventListener('abort', onAbort, { once: true });

  // Handles key press events
  handlePress = (
    str = '',
    key = {
      name: '',
      ctrl: false,
      meta: false,
      shift: false,
      sequence: '',
    },
  ) => {

    if (key.ctrl && key.name === 'c') {
      process.kill(process.pid, 'SIGINT');
      return;
    }

    if (key.ctrl && key.name === '\\') {
      process.kill(process.pid, 'SIGQUIT');
      return;
    }

    if (key.ctrl && key.name === 'z') {
      process.kill(process.pid, 'SIGTSTP');
      return;
    }

    restartReminder();

    // Remove typed characters
    if (key.name === 'backspace' || key.name === 'delete') {
      keysPressed.length > 0 && keysPressed.pop();
      printMessageAndKeys();
      onKeyPress(Object.freeze({ ...key }), str);
      return;
    }

    const isTab =
      key.name === 'tab' ||
      str === '\t' ||
      (key.ctrl === true && key.name === 'i' && key.sequence === '\t');

    // Allow tab to accept the hint
    if (hint && keysPressed.join('').length < 1 && isTab) {
      keysPressed = stripChalkInput(hint).split('');
      printMessageAndKeys();
    }

    // Only push printable characters
    const isPrintable =
      str?.length > 0 &&
      !key.ctrl &&
      !key.meta &&
      key.name !== 'escape' &&
      // eslint-disable-next-line no-control-regex
      !/[\x00-\x1F\x7F]/.test(str);

    if (isPrintable) {
      // Handle pastes
      for (const ch of Array.from(str)) {
        keysPressed.push(ch);
      }
      printMessageAndKeys();
    }

    onKeyPress(Object.freeze({ ...key }), str);

    if (
      (key.name === 'return') ||
      (length && keysPressed.join('').length >= length)
    ) {
      const out = stripChalkInput(keysPressed.slice(0, length).join(''));
      onComplete(out);
      finish(null, out);
      return;
    }
  };

  // Setup readline

  // Turn on key press events from stdin and set raw mode
  readline.emitKeypressEvents(process.stdin);
  setRawMode();

  process.stdin.setEncoding('utf8');

  rl = readline.createInterface({
    input: process.stdin,
    output: echo ? process.stderr : undefined,
    terminal: process.stdin.isTTY,
  });

  rl.on('close', cleanup);
  rl.input.on('keypress', handlePress);

  printMessageAndKeys();
  restartReminder();
});

exports.inputFromTTY = inputFromTTY;
