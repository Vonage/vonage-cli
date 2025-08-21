const chalk = require('chalk');
const { capabilityLabels } = require('../capabilities');
const { promptMessageCapabilities } = require('./capabilities/message');
const { promptNetworkCapabilities } = require('./capabilities/network');
const { promptRTCCapabilities } = require('./capabilities/rtc');
const { promptVoiceCapabilities } = require('./capabilities/voice');
const { promptVideoCapabilities } = require('./capabilities/video');
const { promptVerifyCapabilities } = require('./capabilities/verify');
const { checkbox,
  checkboxSelectedFormatter,
  checkboxHighlightedFormatter,
} = require('../../ux/checkbox');
const { EOL } = require('os');

exports.promptApplicationCapabilities = async () => {
  const appCapabilities = {};
  const whichCapabilities = await checkbox({
    message: 'Which capabilities do you wish to add?',
    items: Object.entries(capabilityLabels)
      .filter(([value]) => value !== 'vbc')
      .map(([value, label]) => ({ value: value, option: label })),
    formatSelected: (option) => chalk.yellow(checkboxSelectedFormatter(option)),
    formatHighlighted: (option) => chalk.blue(checkboxHighlightedFormatter(option)),
  }).then((items) => items.map(({ value }) => value));

  process.stderr.write(EOL);

  console.debug(`Adding ${whichCapabilities.join(',')} capabilities`);

  if (whichCapabilities.includes('messages')) {
    appCapabilities.messages = await promptMessageCapabilities();
    process.stderr.write(EOL);
  }

  if (whichCapabilities.includes('networkApis')) {
    appCapabilities.networkApis = await promptNetworkCapabilities();
    process.stderr.write(EOL);
  }

  if (whichCapabilities.includes('rtc')) {
    appCapabilities.rtc = await promptRTCCapabilities();
    process.stderr.write(EOL);
  }

  if (whichCapabilities.includes('voice')) {
    appCapabilities.voice = await promptVoiceCapabilities();
    process.stderr.write(EOL);
  }

  if (whichCapabilities.includes('video')) {
    appCapabilities.video = await promptVideoCapabilities();
    process.stderr.write(EOL);
  }

  if (whichCapabilities.includes('verify')) {
    appCapabilities.verify = await promptVerifyCapabilities();
    process.stderr.write(EOL);
  }

  return appCapabilities;
};
