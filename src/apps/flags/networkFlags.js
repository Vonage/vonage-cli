const { coerceUrl } = require('../../utils/coerceUrl');

const group = 'Network Capabilities';

const networkFlags = {
  'network-access-type':{
    description: 'Access either sandbox or production',
    group: group,
    choices: ['sandbox', 'production'],
  },
  'network-redirect-url':{
    description: 'URL to redirect to exchange code for token',
    coerce: coerceUrl('network-redirect-url'),
    type: 'boolean',
    group: group,
  },
};

exports.networkGroup = group;
exports.networkFlags = networkFlags;
