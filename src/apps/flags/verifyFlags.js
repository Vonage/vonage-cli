const { coerceUrl } = require('../../utils/coerceUrl');

const group = 'Verify Capabilities';
const verifyFlags = {
  'verify-status-url':{
    description: 'URL for verify status messages',
    implies: ['voice-fallback-url', 'voice-event-url'],
    coerce: coerceUrl('verify-status-url'),
    group,
  },
};

exports.verifyGroup = group;
exports.verifyFlags = verifyFlags;
