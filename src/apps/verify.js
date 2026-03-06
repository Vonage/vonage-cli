import { coerceUrl } from '../utils/coerceUrl.js';
import { coerceRemoveCallback } from '../utils/coerceRemove.js';

const updateVerify = (app, flags) => {
  if (flags.verifyStatusUrl !== undefined) {
    app.capabilities.verify = {
      version: 'v2',
      webhooks: {
        statusUrl: {
          address: flags.verifyStatusUrl,
          httpMethod: 'POST',
        },
      },
    };
  }

  if (flags.verifyStatusUrl === '__REMOVE__') {
    app.capabilities.verify = undefined;
  }
};

const group = 'Verify Capabilities';

const verifyFlags = {
  'verify-status-url':{
    description: 'URL for verify status messages',
    coerce: coerceRemoveCallback(coerceUrl('verify-status-url')),
    group,
  },
};

export const verifyGroup = group;

export { verifyFlags };

export { updateVerify };
