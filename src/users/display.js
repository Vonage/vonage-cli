const chalk = require('chalk');
const { redact } = require('../ux/redact');
const { indentLines } = require('../ux/indentLines');
const { descriptionList } = require('../ux/descriptionList');

const userSummary = ({
  name,
  id,
  displayName,
} = {}) =>
  Object.fromEntries([
    ['User ID', id],
    ['Name', name],
    ['Display Name', displayName],
  ]);

const fullUser = ({imageUrl, properties, ...rest}) => ({
  ...userSummary(rest),
  ['Image URL']: imageUrl,
  ['Time to Live']: properties?.ttl,
});

const userSIPChannelLines = ({sip}) => sip
  ? [
    chalk.underline('SIP'),
    indentLines(
      sip.map(({uri, username, password}) =>
        descriptionList({
          ['URI']: uri,
          ['Username']: username,
          ['Password']: redact(password),
        }) + '\n',
      ).join('\n'),
    ),
  ].join('\n')
  : null;

const userWebsocketChannelHeaderLines = (headers) => headers
  ? [
    '',
    chalk.bold.underline('Headers'),
    indentLines(
      Object.entries(headers).map(([key, value]) =>
        descriptionList({
          [key]: value,
        }) + '\n',
      ).join('\n'),
    ),
  ].join('\n')
  : [];

const userWebsocketChannelLines = ({websocket}) => websocket
  ? [
    chalk.underline('Web Socket'),
    indentLines(
      websocket.map(({uri, contentType, headers}) =>
        descriptionList({
          ['URL']: uri,
          ['Content Type']: contentType,
        }) + userWebsocketChannelHeaderLines(headers),
      ).join('\n'),
    ),
  ].join('\n')
  : null;

const userPSTNChannelLines = ({pstn}) => pstn
  ? [
    chalk.underline('PSTN'),
    indentLines(
      pstn.map(({number}) =>
        descriptionList({
          ['Number']: number,
        }),
      ).join('\n'),
    ),
    '',
  ].join('\n')
  : null;

const userSMSChannelLines = ({sms}) => sms
  ? [
    chalk.underline('SMS'),
    indentLines(
      sms.map(({number}) =>
        descriptionList({
          ['Number']: number,
        }),
      ).join('\n'),
    ),
    '',
  ].join('\n')
  : null;

const userMMSChannelLines = ({mms}) => mms
  ? [
    chalk.underline('MMS'),
    indentLines(
      mms.map(({number}) =>
        descriptionList({
          ['Number']: number,
        }),
      ).join('\n'),
    ),
    '',
  ].join('\n')
  : null;

const userWhatsAppChannelLines = ({whatsapp}) => whatsapp
  ? [
    chalk.underline('WhatsApp'),
    indentLines(
      whatsapp.map(({number}) =>
        descriptionList({
          ['Number']: number,
        }),
      ).join('\n'),
    ),
    '',
  ].join('\n')
  : null;

const userViberChannelLines = ({viber}) => viber
  ? [
    chalk.underline('Viber'),
    indentLines(
      viber.map(({number}) =>
        descriptionList({
          ['Number']: number,
        }),
      ).join('\n'),
    ),
    '',
  ].join('\n')
  : null;

const userMessengerChannelLines = ({messenger}) => messenger
  ? [
    chalk.underline('Messenger'),
    indentLines(
      messenger.map(({id}) =>
        descriptionList({
          ['Id']: id,
        }),
      ).join('\n'),
    ),
    '',
  ].join('\n')
  : null;

const userChannelLines = ({channels = {}}) => {
  const userChannel = [
    indentLines(userPSTNChannelLines(channels)),
    indentLines(userSIPChannelLines(channels)),
    indentLines(userWebsocketChannelLines(channels)),
    indentLines(userSMSChannelLines(channels)),
    indentLines(userMMSChannelLines(channels)),
    indentLines(userWhatsAppChannelLines(channels)),
    indentLines(userViberChannelLines(channels)),
    indentLines(userMessengerChannelLines(channels)),
  ].filter((line) => line);

  console.log([
    'Channels:',

    ...(userChannel.length > 0 ? userChannel : ['  None Set']),
  ].join('\n'));
};

const displayFullUser = (user) =>{
  console.log(
    descriptionList(fullUser(user)),
  );

  console.log('');
  userChannelLines(user);
};

exports.fullUser = fullUser;
exports.displayFullUser = displayFullUser;
exports.userSummary = userSummary;
