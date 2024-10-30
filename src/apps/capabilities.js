const camelCase = require('camelcase');

const capabilityLabels = {
  'messages': 'Messages',
  'networkApis': 'Network APIs',
  'rtc': 'RTC',
  'vbc': 'VBC',
  'verify': 'Verify',
  'video': 'Video',
  'voice': 'Voice',
};

const getAppCapabilities = ({capabilities = {}}) =>
  Object.keys(capabilities).sort().map(capability => camelCase(capability));

exports.getAppCapabilities = getAppCapabilities;

exports.capabilityLabels = capabilityLabels;

exports.capabilities = Object.keys(capabilityLabels);
