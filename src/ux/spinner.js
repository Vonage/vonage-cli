const { hideCursor, resetCursor } = require('./cursor');
const { overwriteLine, overwriteWithNewLine } = require('./clear');
const { EOL } = require('os');
const { detectPlainOutput, getReplayRate } = require('./detectScreenReader');
const { truncateToTerminal } = require('./truncateToTerminal');
const { printEmoji } = require('./printEmoji');

const isPlain = detectPlainOutput();
const replayRate = getReplayRate();

const defaultFrames = [
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

/**
 * @typedef { Object } SpinnerOptions
 * @property { string } message - The message to display alongside the spinner.
 * @property { Array<string> } [frames] - The animation frames to cycle through. Defaults to Braille dots.
 * @property { number } [frameRate] - Delay between frames in milliseconds. Defaults to 80ms.
 * @property { string } [endEmoji] - Emoji to display on successful stop. Defaults to ✅.
 * @property {string} [failedEmoji] - Emoji to display on failure. Defaults to ❌.
 */

/**
 * @typedef { Object } SpinnerHandle
 * @property { StopFunction } stop - Stop the spinner and display a success message.
 * @property { FailFunction } fail - Stop the spinner and display a failure message.
 */

/**
 * @typedef { (endMessage?: string) => void } StopFunction
 * Stops the spinner and displays a success message.
 *
 * @param { string } [endMessage] - Custom message to show when stopping. If omitted, defaults to emoji and message.
 */

/**
 * @typedef { (failMessage?: string) => void } FailFunction
 * Stops the spinner and displays a failure message.
 *
 * @param { string } [failMessage] - Custom message to show when failing. If omitted, defaults to emoji and message.
 */

/**
 * Starts a terminal spinner animation with optional success/failure hooks.
 *
 * Falls back to static repeated output if a screen reader or plain output is detected.
 *
 * @param { SpinnerOptions } options - Configuration for the spinner.
 * @returns { SpinnerHandle } Control functions to stop or fail the spinner.
 */
exports.spinner = ({
  message,
  frames = defaultFrames,
  frameRate = 80,
  endEmoji = '✅',
  failedEmoji = '❌',
}) => {
  let counter = 0;
  const frameLength = isPlain ? replayRate : frames.length;
  if (isPlain) {
    process.stderr.write(truncateToTerminal(`${message}${EOL}`));
  } else {
    hideCursor();
    process.stderr.write(truncateToTerminal(`${frames[counter]} ${message}`));
  }

  const intervalId = setInterval(() => {
    if (isPlain) {
      process.stderr.write(`${message}${EOL}`);
      return;
    }
    overwriteLine(truncateToTerminal(`${frames[counter % frameLength]} ${message}`));
    counter++;
  }, frameRate);

  const end = (endMsg) => {
    clearInterval(intervalId);
    overwriteWithNewLine(truncateToTerminal(endMsg));
    resetCursor();
  };

  return {
    stop: (endMsg) => {
      end(endMsg || `${printEmoji(endEmoji)}${message}`);
    },
    fail: (failMsg) => {
      end(failMsg || `${printEmoji(failedEmoji)}${message}`);
    },
  };
};
