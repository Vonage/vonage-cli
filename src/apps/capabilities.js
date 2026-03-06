import camelCase from 'camelcase';

const capabilityLabels = {
  'messages': 'Messages',
  'networkApis': 'Network APIs',
  'rtc': 'RTC',
  'vbc': 'VBC',
  'verify': 'Verify',
  'video': 'Video',
  'voice': 'Voice',
};

const capabilities = Object.keys(capabilityLabels);

const getAppCapabilities = ({capabilities: appCapabilities = {}} = {}) =>
  Object.keys(appCapabilities)
    .filter((capability) => capabilities.includes(camelCase(capability)))
    .sort()
    .map(capability => camelCase(capability));

export { getAppCapabilities };

export { capabilityLabels };

export { capabilities };
