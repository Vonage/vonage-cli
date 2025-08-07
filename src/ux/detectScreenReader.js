const parser = require('yargs-parser');
const { replayRate, accessibility, plainOutput } = parser(process.argv);


/**
 * Tries to figure out if there is a screen reader in use
 *
 * Check using environment variables or if flags are passed in
 *
 * @returns { boolean } - True if a reader is detected
 */
const detectScreenReader = () => {
  const envVars = process.env;
  const screenReaderEnvVars = ['SCREENREADER', 'ACCESSIBILITY', 'NVDA', 'JAWS', 'VOICEOVER', 'ORCA'];
  const isEnvVarEnabled = screenReaderEnvVars.some((envVar) => envVars[envVar]?.toLowerCase() === 'true' || envVars[envVar]?.toLowerCase() === 'enabled');

  if (isEnvVarEnabled) {
    return true;
  }

  if (accessibility === true) {
    return true;
  }

  // Default to false if no conditions met
  return false;
};

/**
 * Detects if the user wants plain text or not
 *
 * @returns { boolean } - True if the user passed in the plain text flag
 */
const detectPlainOutput = () => {
  if (plainOutput) {
    return true;
  }

  return detectScreenReader();
};

/**
 * Returns a rate at which to refresh dynamic content
 *
 * @returns { number } - The number of seconds to refresh
 */
const getReplayRate = () => parseInt(replayRate || process.env['REPLAY_RATE'] || 6) * 1000;

module.exports = {
  detectScreenReader: detectScreenReader,
  detectPlainOutput: detectPlainOutput,
  getReplayRate: getReplayRate,
};
