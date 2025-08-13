const { overwriteLine } = require('./clear');
const readline = require('readline');

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
 * @param { string } str - A string of all the string characters pressed
 * @returns { void }
 */

/**
 * @typedef { object } InputParams
 * @property { string } [message] - Printable message
 * @property { string } [reminderMessage] - Optional reminder message (defaults to message)
 * @property { number } [reminderInterval] - How often to print the reminder message (defaults to 5000)
 * @property { boolean } [echo] - Whether to echo the typed characters
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
 * @params { InputParams } params for the function
 * @returns { Promise }
 */
const inputFromTTY = (
  {
    message = null,
    reminderMessage = null,
    reminderInterval = 5000,
    echo = true,
    signal,
    length,
    onKeyPress = () => {},
    onComplete = () => {},
    onReminder = () => {},
  } = {},
) => new Promise((resolve, reject) => {
  let done = false;

  const finish = (err, value) => {
    if (done) {
      return;
    }

    done = true;
    cleanup();
    err ? reject(err) : resolve(value);
  };

  // Turn on key press events from stdin and set raw mode
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  // Allow signal controller
  if (signal?.aborted) {
    finish(signal.reason);
    return;
  }

  const keysPressed = [];
  let intervalId;
  reminderMessage = reminderMessage ?? message;

  /**
   * @callback cleanup Cleanup registered listeners
   * @returns { void }
   */
  const cleanup = () => {
    clearInterval(intervalId);
    if (rl) {
      rl.input.off('keypress', handlePress);
      rl.close();
      rl.off('close', cleanup);
    }
    process.off('SIGINT', handleSignal);
    process.off('SIGQUIT', handleSignal);
    process.off('SIGTSTP', handleSignal);
  };

  /**
    * @callback handleSignal Handles control signals. This will exit and kill
    * the process
    */
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
    }
  };

  /**
    * Handles key press events
    */
  const handlePress = (str, key) => {
    clearInterval(intervalId);

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

    // Remove typed characters
    if (key.name === 'backspace' || key.name === 'delete') {
      keysPressed.pop();
      onKeyPress(Object.freeze({ ...key }), str);
      overwriteLine(`${reminderMessage} ${echo ? keysPressed.join('') : ''}`);
      return;
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
      keysPressed.push(str);
    }

    onKeyPress(key, str);

    if (
      (key.name === 'return') ||
      (length && keysPressed.length >= length)
    ) {
      cleanup();
      onComplete(keysPressed.join('').trim());
      finish(null, keysPressed.join('').trim());
      return;
    }

    if (reminderMessage) {
      intervalId = setInterval(
        () => {
          overwriteLine(`${reminderMessage} ${echo ? keysPressed.join('') : ''}`);
          onReminder(keysPressed);
        },
        reminderInterval,
      );
    }
  };

  // Cleanup on abort
  signal?.addEventListener('abort', () => {
    cleanup();
    finish(signal.reason);
  });

  // Setup readline
  process.stdin.setEncoding('utf8');
  const rl = readline.createInterface({
    input: process.stdin,
    output: echo ? process.stderr : undefined,
    terminal: true,
  });

  rl.on('close', cleanup);
  rl.input.on('keypress', handlePress);

  if (message) {
    overwriteLine(`${message} ${keysPressed.join('')}`);

    intervalId = setInterval(
      () => overwriteLine(`${reminderMessage} ${echo ? keysPressed.join('') : ''}`),
      reminderInterval,
    );
  }

  // Handle signals globally
  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGQUIT', () => handleSignal('SIGQUIT'));
  process.on('SIGTSTP', () => handleSignal('SIGTSTP'));
});

exports.inputFromTTY = inputFromTTY;
exports.prompt = (message, options = {}) => inputFromTTY({
  ...options,
  message: message,
}) ;
