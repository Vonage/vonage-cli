const { indentLines } = require('../ux/indentLines');
const { dumpObject, dumpKey } = require('../ux/dump');
const { dumpOnOff, dumpOffOrValue } = require('../ux/dumpYesNo');
const { descriptionList } = require('../ux/descriptionList');
const chalk = require('chalk');
const { capabilityLabels, getAppCapabilities } = require('./capabilities');

const capabilitiesSummary = ({capabilities = {}}) => {
  const appCapabilities = getAppCapabilities({capabilities});

  return appCapabilities.length > 0
    ? appCapabilities.sort().map((capability) => capabilityLabels[capability]).join(', ')
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

  const capabilitiesList = [
    indentLines(displayVoiceApplication(capabilities)),

    indentLines(displayMessagesApplication(capabilities)),

    indentLines(displayVerifyApplication(capabilities)),

    indentLines(displayRTCApplication(capabilities)),

    indentLines(displayVideoApplication(capabilities)),

    indentLines(displayNetworkApplication(capabilities)),

    indentLines(displayVBCApplication(capabilities)),
  ].filter((line) => line);

  console.log([
    'Capabilities:',

    ...(capabilitiesList.length > 0 ? capabilitiesList : ['  None Enabled']),
  ].join('\n'));
};

const dumpWebhook = ({address, httpMethod} = {}) => address
  ? `[${httpMethod || 'POST'}] ${address}`
  : undefined;

const displayVBCApplication = ({vbc}) => {
  if (!vbc) {
    console.debug('No VBC capabilities');
    return;
  }

  return [chalk.underline('NB: VBC capabilities is not supported through the command line.')].join('\n');
};

const displayNetworkApplication = ({networkApis}) => {
  if (!networkApis) {
    console.debug('No network capabilities');
    return;
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
    return;
  }

  const recordings =  [
    `${chalk.underline(dumpKey('RECORDINGS STORAGE'))}:`,
    video.storage?.cloudStorage
      ? indentLines(descriptionList([
        ['Cloud Storage', dumpOnOff(video.storage.cloudStorage)],
        ['Storage Type', video.storage.credentialType],
        ['Credential', video.storage.credential],
        ['End to End Encryption', dumpOnOff(video.storage.endToEndEncryption)],
        ['Server Side Encryption', dumpOnOff(video.storage.serverSideEncryption)],
      ]))
      : indentLines(descriptionList([['Cloud Storage', dumpOnOff(video.storage?.cloudStorage)]])),
  ].join('\n');

  return [
    `${chalk.underline(dumpKey('VIDEO'))}:`,
    indentLines(descriptionList([
      ['Archive Status URL', dumpWebhook(video.webhooks?.archiveStatus)],
      [
        'Archive Status Signature Secret',
        dumpOffOrValue(video.webhooks?.archiveStatus?.secret),
      ],

      ['Broadcast Status URL', dumpWebhook(video.webhooks?.broadcastStatus)],
      [
        'Broadcast Status Signature Secret',
        dumpOffOrValue(video.webhooks?.broadcastStatus?.secret),
      ],

      ['Caption Status URL', dumpWebhook(video.webhooks?.captionsStatus)],
      [
        'Caption Status Signature Secret',
        dumpOffOrValue(video.webhooks?.captionsStatus?.secret),
      ],

      ['Connection Created URL', dumpWebhook(video.webhooks?.connectionCreated)],
      [
        'Connection Created Signature Secret',
        dumpOffOrValue(video.webhooks?.connectionCreated?.secret),
      ],

      ['Connection Destroyed URL', dumpWebhook(video.webhooks?.connectionDestroyed)],
      [
        'Connection Destroyed Signature Secret',
        dumpOffOrValue(video.webhooks?.connectionDestroyed?.secret),
      ],

      ['Render Status URL', dumpWebhook(video.webhooks?.renderStatus)],
      [
        'Render Status Signature Secret',
        dumpOffOrValue(video.webhooks?.renderStatus?.secret),
      ],

      ['SIP Call Created URL', dumpWebhook(video.webhooks?.sipCallCreated)],
      [
        'SIP Call Created Signature Secret',
        dumpOffOrValue(video.webhooks?.sipCallCreated?.secret),
      ],

      ['SIP Call Destroyed URL', dumpWebhook(video.webhooks?.sipCallDestroyed )],
      [
        'SIP Call Destroyed Signature Secret',
        dumpOffOrValue(video.webhooks?.sipCallDestroyed?.secret),
      ],

      ['SIP Call Mute Forced URL', dumpWebhook(video.webhooks?.sipCallMuteForced)],
      [
        'SIP Call Mute Forced Signature Secret',
        dumpOffOrValue(video.webhooks?.sipCallMuteForced?.secret),
      ],

      ['SIP Call Updated URL', dumpWebhook(video.webhooks?.sipCallUpdated)],
      [
        'SIP Call Updated Signature Secret',
        dumpOffOrValue(video.webhooks?.sipCallUpdated?.secret),
      ],

      ['Stream Created URL', dumpWebhook(video.webhooks?.streamCreated)],
      [
        'Stream Created Signature Secret',
        dumpOffOrValue(video.webhooks?.streamCreated?.secret),
      ],

      ['Stream Destroyed URL', dumpWebhook(video.webhooks?.streamDestroyed)],
      [
        'Stream Destroyed Signature Secret',
        dumpOffOrValue(video.webhooks?.streamDestroyed?.secret),
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
    return;
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
    return;
  }

  return [
    `${chalk.underline(dumpKey('MESSAGES'))}:`,
    indentLines(descriptionList([
      ['Authenticate Inbound Media', dumpOnOff(messages.authenticateInboundMedia)],
      ['Webhook Version', messages.version],
      ['Status URL',dumpWebhook(messages.webhooks?.statusUrl)],
      ['Inbound URL', dumpWebhook(messages.webhooks?.inboundUrl)],
    ])),
    '',
  ].join('\n');
};

const displayRTCApplication = ({rtc}) => {
  if (!rtc) {
    console.debug('No RTC capabilities');
    return;
  }

  return [
    `${chalk.underline(dumpKey('RTC'))}:`,
    indentLines(descriptionList([
      ['Event URL', dumpWebhook(rtc.webhooks?.eventUrl)],
      ['Uses Signed callbacks', dumpOnOff(rtc.signedCallbacks)],
    ])),
    '',
  ].join('\n');
};

const displayVoiceApplication = ({voice}) => {
  if (!voice) {
    console.debug('No voice capabilities');
    return;
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
  displayCapabilities: displayCapabilities,
  displayVoiceApplication: displayVoiceApplication,
  displayRTCApplication: displayRTCApplication,
  displayMessagesApplication: displayMessagesApplication,
  displayVerifyApplication: displayVerifyApplication,
  listApplications: listApplications,
};
