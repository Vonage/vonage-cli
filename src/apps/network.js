const { coerceUrl } = require('../utils/coerceUrl');
const { coerceRemoveCallback, coerceRemove } = require('../utils/coerceRemove');

const updateNetwork = (app, flags) => {
  const newNetwork = {
    networkApplicationId: app.capabilities?.networkApis?.networkApplicationId,
    redirectUrl: app.capabilities?.networkApis?.redirectUrl,
  };

  if (flags.networkAppId) {
    newNetwork.networkApplicationId = flags.networkAppId;
  }

  if (flags.networkRedirectUrl) {
    newNetwork.redirectUrl = flags.networkRedirectUrl;
  }

  app.capabilities.networkApis = JSON.parse(JSON.stringify(newNetwork));

  console.debug('Updated Network capabilities', app.capabilities.networkApis);
};

const group = 'Network Capabilities';

const networkFlags = {
  'network-app-id': {
    description: 'Network registration application ID',
    type: 'string',
    group: group,
    coerce: coerceRemove,
  },
  'network-redirect-url':{
    description: 'URL to redirect to exchange code for token',
    coerce: coerceRemoveCallback(coerceUrl('network-redirect-url')),
    type: 'boolean',
    group: group,
    implies: ['network-app-id'],
  },
};

exports.networkGroup = group;

exports.networkFlags = networkFlags;

exports.updateNetwork = updateNetwork;
