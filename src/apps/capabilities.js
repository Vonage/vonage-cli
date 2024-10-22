const capabilityLabels = {
  'messages': 'Messages',
  'network_apis': 'Network APIs',
  'rtc': 'RTC',
  'vbc': 'VBC',
  'verify': 'Verify',
  'video': 'Video',
  'voice': 'Voice',
};

const getAppCapabilities = ({capabilities = {}}) => Object.keys(capabilityLabels)
  .reduce(
    (acc, capability) => {
      if (capabilities[capability]) {
        acc.push(capability);
      }

      if (capability === 'network_apis' && capabilities['networkApis']) {
        acc.push('network');
      }
      return acc;
    },
    [],
  ).sort();

const capabilitiesSummary = ({capabilities = {}}) => {
  const appCapabilities = getAppCapabilities({capabilities});

  return appCapabilities.length > 0
    ? appCapabilities.map((capability) => capabilityLabels[capability]).join(', ')
    : 'None';
};

exports.capabilitiesSummary = capabilitiesSummary;

exports.getAppCapabilities = getAppCapabilities;

exports.capabilityLabels = capabilityLabels;

exports.capabilities = Object.keys(capabilityLabels);
