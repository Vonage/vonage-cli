const { dumpObject, dumpKey } = require('../ux/dump');
const { dumpYesNo } = require('../ux/dumpYesNo');
const { descriptionList } = require('../ux/descriptionList');
const chalk = require('chalk');

const capabilityLabels = {
  'meetings': 'Meetings',
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
    ['Improve AI', dumpYesNo(app.privacy?.improveAI, true)],
  ]));
  console.log('');
  displayCapabilities(app);
};

const displayCapabilities = ({capabilities}) => {
  if (!capabilities) {
    console.debug('No capabilities');
    return;
  }

  displayVoiceApplication(capabilities);
  displayMessagesApplication(capabilities);
  displayVerifyApplication(capabilities);
  displayMeetingsApplication(capabilities);

  displayRTCApplication(capabilities);
  displayVideoApplication(capabilities);
  displayNetworkApplication(capabilities);
  displayVBCApplication(capabilities);
};

const dumpWebhook = ({address, httpMethod} = {}) => address
  ? `${address} [${httpMethod}]`
  : undefined;

const displayVBCApplication = ({vbc}) => {
  if (!vbc) {
    console.debug('No VBC capabilities');
    return;
  }

  console.log(chalk.italic('VBC capabilities is currently not supported through the command line'));
  console.log('');
};

const displayNetworkApplication = ({networkApis}) => {
  if (!networkApis) {
    console.debug('No network capabilities');
    return;
  }

  console.log(chalk.italic('Network capabilities is currently not supported through the command line'));
  console.log('');
};

const displayVideoApplication = ({video}) => {
  if (!video) {
    console.debug('No video capabilities');
    return;
  }

  console.log(chalk.italic('Video capabilities is currently not supported through the command line'));
  console.log('');
};

const displayMeetingsApplication = ({meetings}) => {
  if (!meetings) {
    console.debug('No meetings capabilities');
    return;
  }
  console.log(`${chalk.underline(dumpKey('Meetings capabilities (deprecated)'))}:`);
  console.log(descriptionList([
    ['Room changed URL', dumpWebhook(meetings.webhooks.roomChanged)],
    ['Session changed URL', dumpWebhook(meetings.webhooks.sessionChanged)],
    ['Recording changed URL', dumpWebhook(meetings.webhooks.recordingChanged)],
  ]));
  console.log('');
};

const displayVerifyApplication = ({verify}) => {
  if (!verify) {
    console.debug('No verify capabilities');
    return;
  }

  console.log(`${chalk.underline(dumpKey('Verify capabilities'))}:`);
  console.log(descriptionList([
    ['Webhook Version', verify.version],
    ['Status URL', dumpWebhook(verify.webhooks.statusUrl)],
  ]));
  console.log('');
};

const displayMessagesApplication = ({messages}) => {
  if (!messages) {
    console.debug('No messages capabilities');
    return;
  }

  console.log(`${chalk.underline(dumpKey('Message capabilities'))}:`);

  console.log(descriptionList([
    ['Authenticate Inbound Media', dumpYesNo(messages.authenticateInboundMedia)],
    ['Webhook Version', messages.version],
    ['Status URL',dumpWebhook(messages.webhooks.statusUrl)],
    ['Inbound URL', dumpWebhook(messages.webhooks.inboundUrl)],
  ]));
  console.log('');
};

const displayRTCApplication = ({rtc}) => {
  if (!rtc) {
    console.debug('No RTC capabilities');
    return;
  }

  console.log(chalk.italic('RTC capabilities is currently in beta and not supported through the command line'));
  console.log('');
};

const displayVoiceApplication = ({voice}) => {
  if (!voice) {
    console.debug('No voice capabilities');
    return;
  }

  console.log(`${chalk.underline(dumpKey('Voice capabilities'))}:`);
  console.log(descriptionList([
    ['Uses Signed callbacks', dumpYesNo(voice.signedCallbacks)],
    ['Conversation TTL', voice.conversationsTtl],
    ['Leg Persistence Time', voice.legPersistenceTime],
    ['Event URL', dumpWebhook(voice.webhooks.eventUrl)],
    ['Answer URL', dumpWebhook(voice.webhooks.answerUrl)],
    ['Fallback URL', dumpWebhook(voice.webhooks.fallbackAnswerUrl)],
  ]));
  console.log('');
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
  displayMeetingsApplication: displayMeetingsApplication,
  listApplications: listApplications,
  capabilityLabels: capabilityLabels,
  capabilities: Object.keys(capabilityLabels),
};
