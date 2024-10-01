const { indentLines } = require('../ux/indentLines');
const { dumpObject, dumpKey } = require('../ux/dump');
const { dumpOnOff } = require('../ux/dumpYesNo');
const { descriptionList } = require('../ux/descriptionList');
const chalk = require('chalk');

const capabilityLabels = {
  'messages': 'Messages',
  'network_apis': 'Network APIs',
  'rtc': 'RTC',
  'vbc': 'VBC',
  'verify': 'Verify',
  'video': 'Video',
  'voice': 'Voice',
};

const getAppCapabilities = ({capabilities = {}}) => Object.entries(capabilityLabels)
  .reduce(
    (acc, [capability]) => {
      if (capabilities[capability]) {
        acc.push(capability);
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

const listApplications = (apps) => {
  console.table(apps.map((app) => buildApplicationSummary(app)));
};

const buildApplicationSummary = (app) => ({
  'App ID': app.id,
  'Name': app.name,
  'Capabilities': capabilitiesSummary(app),
});

const displayApplication = (app) => {
  console.debug(`Displaying application ${dumpObject(app)}`);
  console.log(descriptionList([
    ['Name', app.name],
    ['Application ID', app.id],
    ['Improve AI', dumpOnOff(app.privacy?.improveAI)],
    ['Private/Public Key', app.keys?.publicKey ? 'Set' : 'Not Set'],
  ]));
  console.log('');
  displayCapabilities(app);
};

const displayCapabilities = ({capabilities}) => {
  if (!capabilities) {
    console.debug('No capabilities');
    return;
  }

  console.log([
    'Capabilities',
    indentLines(displayVoiceApplication(capabilities)),

    indentLines(displayMessagesApplication(capabilities)),

    indentLines(displayVerifyApplication(capabilities)),

    indentLines(displayRTCApplication(capabilities)),

    indentLines(displayVideoApplication(capabilities)),

    indentLines(displayNetworkApplication(capabilities)),

    indentLines(displayVBCApplication(capabilities)),
  ].join('\n'));
};

const dumpWebhook = ({address, httpMethod} = {}) => address
  ? `[${httpMethod || 'POST'}] ${address}`
  : undefined;

const displayVBCApplication = ({vbc}) => {
  if (!vbc) {
    console.debug('No VBC capabilities');
    return '';
  }

  return [chalk.underline('NB: VBC capabilities is not supported through the command line.')].join('\n');
};

const displayNetworkApplication = ({networkApis}) => {
  if (!networkApis) {
    console.debug('No network capabilities');
    return '';
  }

  return [
    `${chalk.underline(dumpKey('NETWORK APIS'))}:`,
    indentLines(descriptionList([
      [
        'Redirect URL',
        dumpWebhook({address: networkApis.redirectUri, httpMethod: 'GET'}),
      ],
    ])),
    '',
  ].join('\n');
};

const displayVideoApplication = ({video}) => {
  if (!video) {
    console.debug('No video capabilities');
    return '';
  }

  const recordings =  [
    `${chalk.underline(dumpKey('RECORDINGS STORAGE'))}:`,
    video.storage.cloudStorage
      ? indentLines(descriptionList([
        ['Cloud Storage', dumpOnOff(video.storage.cloudStorage)],
        ['Storage Type', video.storage.credentialType],
        ['Crednetial', video.storage.credential],
      ]))
      : indentLines(descriptionList([['Cloud Storage', dumpOnOff(video.storage.cloudStorage)]])),
  ].join('\n');

  return [
    `${chalk.underline(dumpKey('VIDEO'))}:`,
    indentLines(descriptionList([
      ['Session URL', dumpWebhook(video.webhooks.streamCreated)],
      [
        'Session Signature Secret',
        video.webhooks.streamCreated?.secret || 'Off',
      ],

      ['Recordings URL', dumpWebhook(video.webhooks.archiveStatus)],
      [
        'Recordings Signature Secret',
        video.webhooks.archiveStatus?.secret || 'Off',
      ],

      ['Monitoring URL', dumpWebhook(video.webhooks?.broadcastStatus)],
      [
        'Monitoring Signature Secret',
        video.webhooks.broadcastStatus?.secret || 'Off',
      ],

      ['Composer URL', dumpWebhook(video.webhooks.renderStatus)],
      [
        'Composer Signature Secret',
        video.webhooks.renderStatus?.secret || 'Off',
      ],

      ['Caption URL', dumpWebhook(video.webhooks.captionsStatus)],
      [
        'Caption Signature Secret',
        video.webhooks.captionsStatus?.secret || 'Off',
      ],

      ['SIP Monitoring', dumpWebhook(video.webhooks.sipCallCreated)],
      [
        'SIP Signature Secret',
        video.webhooks.sipCallCreated?.secret || 'Off',
      ],
    ])),
    '',
    indentLines(recordings),
    '',
  ].join('\n');
};

const displayVerifyApplication = ({verify}) => {
  if (!verify) {
    console.debug('No verify capabilities');
    return '';
  }

  return [
    `${chalk.underline(dumpKey('VERIFY'))}:`,
    indentLines(descriptionList([
      ['Webhook Version', verify.version],
      ['Status URL', dumpWebhook(verify.webhooks.statusUrl)],
    ])),
    '',
  ].join('\n');
};

const displayMessagesApplication = ({messages}) => {
  if (!messages) {
    console.debug('No messages capabilities');
    return '';
  }

  return [
    `${chalk.underline(dumpKey('MESSAGES'))}:`,
    indentLines(descriptionList([
      ['Authenticate Inbound Media', dumpOnOff(messages.authenticateInboundMedia)],
      ['Webhook Version', messages.version],
      ['Status URL',dumpWebhook(messages.webhooks.statusUrl)],
      ['Inbound URL', dumpWebhook(messages.webhooks.inboundUrl)],
    ])),
    '',
  ].join('\n');
};

const displayRTCApplication = ({rtc}) => {
  if (!rtc) {
    console.debug('No RTC capabilities');
    return '';
  }

  return [
    `${chalk.underline(dumpKey('RTC'))}:`,
    indentLines(descriptionList([
      ['Event URL', dumpWebhook(rtc.webhooks.eventUrl)],
      ['Uses Signed callbacks', dumpOnOff(rtc.signedCallbacks)],
    ])),
    '',
  ].join('\n');
};

const displayVoiceApplication = ({voice}) => {
  if (!voice) {
    console.debug('No voice capabilities');
    return '';
  }
  return [
    `${chalk.underline(dumpKey('VOICE'))}:`,
    indentLines(descriptionList([
      ['Uses Signed callbacks', dumpOnOff(voice.signedCallbacks)],
      ['Conversation TTL', `${voice.conversationsTtl} hours`],
      ['Leg Persistence Time', `${voice.legPersistenceTime} days`],
      ['Event URL', dumpWebhook(voice.webhooks.eventUrl)],
      ['Answer URL', dumpWebhook(voice.webhooks.answerUrl)],
      ['Fallback URL', dumpWebhook(voice.webhooks.fallbackAnswerUrl)],
    ])),
    '',
  ].join('\n');
};

module.exports = {
  displayApplication: displayApplication,
  getAppCapabilities: getAppCapabilities,
  capabilitiesSummary: capabilitiesSummary,
  displayCapabilities: displayCapabilities,
  displayVoiceApplication: displayVoiceApplication,
  displayRTCApplication: displayRTCApplication,
  displayMessagesApplication: displayMessagesApplication,
  displayVerifyApplication: displayVerifyApplication,
  listApplications: listApplications,
  capabilityLabels: capabilityLabels,
  capabilities: Object.keys(capabilityLabels),
};
