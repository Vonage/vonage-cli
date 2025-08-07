const chalk = require('chalk');
const { dumpYesNo } = require('../ux/dumpYesNo');
const { indentLines } = require('../ux/indentLines');
const { descriptionList } = require('../ux/descriptionList');
const { displayDate } = require('../ux/locale');

const conversationSummary = ({
  name,
  id,
  displayName,
  imageUrl,
} = {}) =>
  Object.fromEntries([
    ['Name', name],
    ['Conversation ID', id],
    ['Display Name', displayName],
    ['Image URL', imageUrl],
  ]);


const displayConversation = (conversation) =>{
  console.log(
    descriptionList([
      ...Object.entries(conversationSummary(conversation)),
      ['State', conversation.state],
      ['Time to Leave', conversation.properties?.ttl],
      ['Created at', displayDate(conversation.timestamp?.created)],
      ['Updated at', displayDate(conversation.timestamp?.updated)],
      ['Destroyed at', displayDate(conversation.timestamp?.destroyed)],
      ['Sequence', conversation.sequenceNumber],
    ]),
  );

  console.log('');
  console.log(chalk.underline('Media State:'));
  console.log(indentLines(descriptionList([
    ['Earmuffed', dumpYesNo(conversation.mediaState?.earmuff)],
    ['Muted', dumpYesNo(conversation.mediaState?.mute)],
    ['Playing Stream', dumpYesNo(conversation.mediaState?.playStream)],
    ['Recording', dumpYesNo(conversation.mediaState?.recording)],
    ['Transcribing', dumpYesNo(conversation.mediaState?.transcribing)],
    ['Text To Speech', dumpYesNo(conversation.mediaState?.tts)],
  ])));
};

exports.displayConversation = displayConversation;
exports.conversationSummary = conversationSummary;
