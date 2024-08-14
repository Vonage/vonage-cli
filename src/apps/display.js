const { dumpObject, dumpKey } = require('../ux/dump');
const { dumpYesNo } = require('../ux/dumpYesNo');
const { descriptionList } = require('../ux/descriptionList');
const chalk = require('chalk');

const displayFlags = {
  'show-voice': {
    describe: 'Show voice capabilities',
    type: 'boolean',
    group: 'Capabilities',
    conflicts: ['json', 'yaml'],
  },
  'show-messages': {
    describe: 'Show message capabilities',
    type: 'boolean',
    group: 'Capabilities',
    conflicts: ['json', 'yaml'],
  },
  'show-verify': {
    describe: 'Show verify capabilities',
    type: 'boolean',
    group: 'Capabilities',
    conflicts: ['json', 'yaml'],
  },
  'show-meetings': {
    describe: 'Show meetings capabilities',
    type: 'boolean',
    group: 'Capabilities',
    conflicts: ['json', 'yaml'],
  },
};

const capabilityLabels = {
  'voice': 'Voice',
  'rtc': 'RTC',
  'messages': 'Messages',
  'verify': 'Verify',
  'meetings': 'Meetings',
  'network_apis': 'Network APIs',
  'vbc': 'VBC',
};

const capabilitiesSummary = ({capabilities = {}}) => {
  const appCapabilities = Object.entries(capabilityLabels).reduce(
    (acc, [capability, label]) => {
      if (capabilities[capability]) {
        acc.push(label);
      }
      return acc;
    },
    [],
  );

  return appCapabilities.length > 0 ? appCapabilities.join(', ') : 'None';
};

const listApplications = (args, apps) => {
  const displayApps = apps.map((app) => buildApplicationSummary(args, app));
  console.table(displayApps);
};

const buildApplicationSummary = (argv, app) => {
  console.debug(`Build application summary ${dumpObject(app)}`);

  const displayApp = {
    'Name': app.name,
    'Capabilities': capabilitiesSummary(app),
  };

  if (argv['show-voice']) {
    console.debug('Adding voice capabilities');
    const voice = app.capabilities.voice || {};
    displayApp['Voice: Uses Signed callbacks'] = dumpYesNo(voice?.signedCallbacks);
    displayApp['Voice: Conversation TTL'] = voice?.conversationsTtl;
    displayApp['Voice: Leg Persistence Time'] = voice?.legPersistenceTime;
    displayApp['Voice: Event URL'] = dumpWebhook(voice?.webhooks?.eventUrl);
    displayApp['Voice: Answer URL'] = dumpWebhook(voice?.webhooks?.answerUrl);
    displayApp['Voice: Fallback URL'] = dumpWebhook(voice?.webhooks?.fallbackAnswerUrl);
  }

  if (argv['show-messages']) {
    console.debug('Displaying messaging capabilities');
    const messages = app.capabilities.messages || {};
    displayApp['Messages: Authenticate Inbound Media'] = dumpYesNo(messages?.authenticateInboundMedia);
    displayApp['Messages: Webhook Version'] = messages?.version;
    displayApp['Messages: Status URL'] = dumpWebhook(messages?.webhooks?.statusUrl);
    displayApp['Messages: Inbound URL'] = dumpWebhook(messages?.webhooks?.inboundUrl);
  }

  if (argv['show-verify']) {
    console.debug('Displaying verify capabilities');
    const verify = app.capabilities.verify || {};
    displayApp['Messages: Webhook Version'] = verify?.version;
    displayApp['Messages: Status URL'] = dumpWebhook(verify?.webhooks?.statusUrl);
  }

  if (argv['show-meetings']) {
    console.debug('Displaying meetings capabilities');
    const meetings = app.capabilities.meetings || {};
    displayApp['Meetings: Room changed URL'] = dumpWebhook(meetings?.webhooks?.roomChanged);
    displayApp['Meetings: Session changed URL'] = dumpWebhook(meetings?.webhooks?.sessionChanged);
    displayApp['Meetings: Recording changed URL'] = dumpWebhook(meetings?.webhooks?.recordingChanged);
  }

  return displayApp;
};

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
  capabilitiesSummary: capabilitiesSummary,
  displayCapabilities: displayCapabilities,
  displayVoiceApplication: displayVoiceApplication,
  displayRTCApplication: displayRTCApplication,
  displayMessagesApplication: displayMessagesApplication,
  displayVerifyApplication: displayVerifyApplication,
  displayMeetingsApplication: displayMeetingsApplication,
  listApplications: listApplications,
  displayFlags: displayFlags,
};
