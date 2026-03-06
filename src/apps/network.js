import { coerceUrl } from '../utils/coerceUrl.js';
import { coerceRemoveCallback, coerceRemove } from '../utils/coerceRemove.js';

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

export const networkGroup = group;

export { networkFlags };

export { updateNetwork };
