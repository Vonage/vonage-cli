const dumpBoolean = ({value, trueWord = 'Yes', falseWord = 'No', includeText=false, noEmoji=false}) => value
  ? `${!noEmoji ? '✅' : ''}${includeText ? trueWord : ''}`
  : `${!noEmoji ? '❌' : ''}${includeText ? falseWord : ''}`;

exports.dumpBoolean = dumpBoolean;

exports.dumpYesNo = (value, includeText=false) => dumpBoolean({
  value: value,
  trueWord: 'Yes',
  falseWord: 'No',
  includeText: includeText,
});

exports.dumpOnOff = (value, includeText=false) => dumpBoolean({
  value: value,
  trueWord: 'On',
  falseWord: 'Off',
  includeText: includeText,
});

exports.dumpEnabledDisabled = (value, includeText=false) => dumpBoolean({
  value: value,
  trueWord: 'Enabled',
  falseWord: 'Disabled',
  includeText: includeText,
});

