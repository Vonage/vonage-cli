const { userSummary } = require('../users/display');
const chalk = require('chalk');
const { descriptionList } = require('../ux/descriptionList');
const { indentLines } = require('../ux/indentLines');
const { dumpYesNo } = require('../ux/dumpYesNo');
const { displayDate } = require('../ux/locale');

const stateLabels = {
  INVITED: 'Invited',
  JOINED: 'Joined',
  LEFT: 'Left',
  UNKNOWN: 'Unknown',
};

const channelLabels = {
  app: 'Application',
  phone: 'Phone',
  sms: 'SMS',
  mms: 'MMS',
  whatsapp: 'WhatsApp',
  viber: 'Viber',
  messenger: 'Messenger',
};

const memberSummary = ({id, state}) => Object.fromEntries([
  ['Member ID', id],
  ['State', stateLabels[state]],
]);

const memberTimestamps = ({invited, joined, left}) => Object.fromEntries([
  ['Invited', displayDate(invited)],
  ['Joined', displayDate(joined)],
  ['Left', displayDate(left)],
]);

const memberChannelType = (from) => from
  ? from.type.split(',')
    .map((channel) => channelLabels[channel])
    .join(', ')
  : undefined;

const memberChannel = (channel) =>  {
  const memberChannel = {
    'Channel Type': channelLabels[channel?.type],
    'Can accept messages from': memberChannelType(channel?.from),
  };

  switch (channel?.type) {
  case 'app':
    Object.assign(
      memberChannel,
      {
        'Can message user': channel?.to?.user,
      },
    );
    break;

  case 'phone':
    Object.assign(
      memberChannel,
      {
        'Can call': channel?.to?.number,
      },
    );
    break;

  case 'sms':
    Object.assign(
      memberChannel,
      {
        'Can send SMS messages to': channel?.to?.number,
      },
    );
    break;

  case 'mms':
    Object.assign(
      memberChannel,
      {
        'Can send MMS messages to': channel?.to?.number,
      },
    );
    break;

  case 'whatsapp':
    Object.assign(
      memberChannel,
      {
        'Can send WhatsApp messages to': channel?.to?.number,
      },
    );
    break;

  case 'viber':
    Object.assign(
      memberChannel,
      {
        'Can send Viber messages to': channel?.to?.id,
      },
    );
    break;

  case 'messenger':
    Object.assign(
      memberChannel,
      {
        'Can send Messenger messages to': channel?.to?.id,
      },
    );
    break;
  }

  return memberChannel;
};

const displayChannel = (channel) => {
  console.log(chalk.underline('Channel'));
  console.log(indentLines(descriptionList(memberChannel(channel))));
};

const displayTimestamps = (timestamps) => {
  console.log(chalk.underline('Timestamps'));
  console.log(indentLines(descriptionList(memberTimestamps(timestamps))));
};

const displayFullMember = (member) => {
  console.debug('Display full member', member);
  console.log(
    descriptionList({
      ...memberSummary(member),
      'Knocking Id': member.knockingId,
      'Invited by': member.memberIdInviting,
    }),
  );

  if (Object.hasOwn('joined', member.initiator)) {
    console.log(descriptionList({
      ['Invited by user']: member.initiator.userId,
      ['As member']: member.initiator.memberId,
    }));
  }

  if (Object.hasOwn('invited', member.initiator)) {
    console.log(descriptionList({
      ['Invited by admin']: dumpYesNo(member.initiator.admin),
    }));
  }

  console.log('');
  console.log(chalk.underline('User'));
  console.log(indentLines(descriptionList(userSummary(member.user))));

  console.log('');
  displayTimestamps(member.timestamp);

  console.log('');
  displayChannel(member.channel);
};

exports.displayChannel = displayChannel;
exports.displayTimestamps = displayTimestamps;
exports.memberChannel = memberChannel;
exports.memberTimestamps = memberTimestamps;
exports.stateLabels = stateLabels;
exports.memberSummary = memberSummary;
exports.displayFullMember = displayFullMember;
exports.memberChannelType = memberChannelType;
