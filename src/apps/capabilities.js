const capabilityLabels = {
  'messages': 'Messages',
  'network_apis': 'Network APIs',
  'rtc': 'RTC',
  'vbc': 'VBC',
  'verify': 'Verify',
  'video': 'Video',
  'voice': 'Voice',
};

exports.capabilityLabels = capabilityLabels;

exports.capabilities = Object.keys(capabilityLabels);
