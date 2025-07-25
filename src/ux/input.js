const readline = require('readline');

/**
 * Print out the message to stdErr and the keys keys the user has pressed
 */
const printMessageAndKeys = (message, keysPressed) => process.stderr.write(
  `${message} ${keysPressed.join('')}`,
);

/**
 * Prints the message with a carriage return
 */
const returnAndPrintMessage = (message, keysPressed) => {
  process.stderr.write('\r');
  printMessageAndKeys(message, keysPressed);
};

/**
 * @typedef { Object } Key
 * @property { string } name - The name of the key pressed (e.g., 'a', 'return', 'escape', 'left', etc.)
 * @property { string } [sequence] - The raw sequence of characters representing the key
 * @property { boolean } [ctrl] - Whether the Control key was held down
 * @property { boolean } [meta] - Whether the Meta key (Alt/Option) was held down
 * @property { boolean } [shift] - Whether the Shift key was held down
 * @property { string } [code] - Raw code of the key, if available
 */

/**
 * @callback onKeyPress
 * @params { Key } key Data about the key
 * @params { string } str All the string characters pressed during input
 * @returns { void }
 */

/**
 * @callback onComplete
 * @params { String } str a string of all the string characters pressed
 * @returns { voice }


/**
 * @typedef { object } InputParams
 * @property { String } [message] Printable message
 * @property { String } [reminderMessage] Optional reminder message (defaults to message)
 * @property { Number } [reminderInterval] How often to print the reminder message (defaults to 5000)
 * @property { AbortSignal } [signal] Abort controller
 * @property { Number } [length] How many key presses to accept before resolving
 * @property { onKeyPress } [onKeyPress] Optional keypress function
 * @property { onComplete } [onComplete] Optional completed function
 */

/**
 * Accept input from the terminal
 *
 * This will continue to listen for keypress events until either the return key
 * is pressed, or the number of printable characters has reached the length.
 *
 * @params { InputParams } parameters for the function
 * @returns { Promise }
 */
const inputFromTTY = (
  {
    message = null,
    reminderMessage = null,
    reminderInterval = 5000,
    signal,
    length,
    onKeyPress = () => {},
    onComplete = () => {},
  } = {},
) => new Promise((resolve, reject) => {
  // Turn on key press events from stdin and set raw mode
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  // Allow signal controller
  if (signal?.aborted) {
    reject(signal.reason);
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
    rl.input.off('keypress', handlePress);
    rl.close();
    process.off('SIGINT', handleSignal);
    process.off('SIGQUIT', handleSignal);
    process.off('SIGTSTP', handleSignal);
    rl.off('close', cleanup);
  };

  /**
    * @callback handleSignal Handles control signals. This will exit and kill
    * the process
    */
  const handleSignal = (signal) => {
    switch (signal) {
    case 'SIGINT':
      cleanup();
      process.exitCode(130);
      break;

    case 'SIGQUIT':
      cleanup();
      process.exitCode(131);
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
    Object.freeze(key);
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

    if (key.name === 'backspace' || key.name === 'delete') {
      keysPressed.pop();
      onKeyPress(key, str);
      return;
    }

    // Only push printable characters
    const isPrintable =
      str.length > 0 &&
      !key.ctrl &&
      !key.meta &&
      key.name !== 'escape' &&
      !/[\p{C}]/u.test(str);

    if (isPrintable) {
      keysPressed.push(str);
    }

    onKeyPress(key, str);

    if (
      (key.name === 'return') ||
      (length && keysPressed.length >= length)
    ) {
      cleanup();
      resolve(keysPressed.join('').trim());
      onComplete(keysPressed.join('').trim());
      return;
    }

    if (intervalId) {
      intervalId = setInterval(
        () => returnAndPrintMessage(reminderMessage, keysPressed),
        reminderInterval,
      );
    }
  };

  // Cleanup on abort
  signal?.addEventListener('abort', () => {
    cleanup();
    reject(signal.reason);
  });

  // Setup readline
  process.stdin.setEncoding('utf8');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
    terminal: true,
  });

  rl.on('close', cleanup);
  rl.input.on('keypress', handlePress);

  if (message) {
    printMessageAndKeys(message, keysPressed);

    intervalId = setInterval(
      () => returnAndPrintMessage(reminderMessage, keysPressed),
      reminderInterval,
    );
  }

  // Handle signals globally
  process.on('SIGINT', () => handleSignal('SIGINT'));
  process.on('SIGQUIT', () => handleSignal('SIGQUIT'));
  process.on('SIGTSTP', () => handleSignal('SIGTSTP'));
});

exports.inputFromTTY = inputFromTTY;
