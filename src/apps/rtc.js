const { coerceUrl } = require('../utils/coerceUrl');
const { coerceRemoveCallback, coerceRemoveList } = require('../utils/coerceRemove');

const updateRTC = (app, flags) => {
  const newRTC = {
    webhooks: {
      eventUrl: {
        address: app.capabilities?.rtc?.webhooks?.eventUrl?.address,
        httpMethod: app.capabilities?.rtc?.webhooks?.eventUrl?.httpMethod,
      },
    },
    signedCallbacks: app.capabilities?.rtc?.signedCallbacks,
  };

  console.debug(`eventurl: ${flags.rtcEventUrl}`);
  if (flags.rtcEventUrl)  {
    newRTC.webhooks.eventUrl.address = flags.rtcEventUrl;
  }

  if (flags.rtcEventMethod) {
    newRTC.webhooks.eventUrl.httpMethod = flags.rtcEventMethod;
  }

  if (flags.rtcSignedEvent) {
    newRTC.signedCallbacks = flags.rtcSignedEvent;
  }

  // Make sure we have a default method for the event URL
  if (!newRTC.webhooks.eventUrl.httpMethod && newRTC.webhooks.eventUrl.address) {
    newRTC.webhooks.eventUrl.httpMethod = 'POST';
  }

  // Remove undefined values
  app.capabilities.rtc = JSON.parse(JSON.stringify(newRTC));

  if (Object.keys(app.capabilities.rtc).length < 1) {
    app.capabilities.rtc = undefined;
  }

  console.debug('Updated RTC capabilities', app.capabilities.rtc);
};

const group = 'RTC Capabilities';

const rtcFlags = {
  'rtc-event-url':{
    description: 'URL to receive RTC events',
    coerce: coerceRemoveCallback(coerceUrl('rct-event-url')),
    group: group,
  },
  'rtc-event-method':{
    description: 'HTTP method for RTC events',
    coerce: coerceRemoveList('rtc-event-method', ['GET', 'POST']),
    group: group,
  },
  'rtc-signed-event':{
    description: 'Used signed webhook for RTC events',
    type: 'boolean',
    group: group,
  },
};

exports.rtcGroup = group;

exports.rtcFlags = rtcFlags;

exports.updateRTC = updateRTC;
