const parser = require('yargs-parser');
const { replayRate, accessibility, plainOutput } = parser(process.argv);

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

const detectPlainOutput = () => {
  if (plainOutput) {
    return true;
  }

  return detectScreenReader();
};

const getReplayRate = () => parseInt(replayRate || process.env['REPLAY_RATE'] || 6) * 1000;

module.exports = {
  detectScreenReader: detectScreenReader,
  detectPlainOutput: detectPlainOutput,
  getReplayRate: getReplayRate,
};
