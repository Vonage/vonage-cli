const dumpBoolean = ({value, trueWord = 'Yes', falseWord = 'No', includeText=false, noEmoji=false}) => value
  ? `${!noEmoji ? '✅ ' : ''}${includeText ? trueWord : ''}`
  : `${!noEmoji ? '❌ ' : ''}${includeText ? falseWord : ''}`;

exports.dumpBoolean = dumpBoolean;

exports.dumpYesNo = (value, includeText=true) => dumpBoolean({
  value: value,
  trueWord: 'Yes',
  falseWord: 'No',
  includeText: includeText,
});

exports.dumpOnOff = (value) => dumpBoolean({
  value: value,
  trueWord: 'On',
  falseWord: 'Off',
  includeText: true,
  noEmoji: true,
});

exports.dumpEnabledDisabled = (value, includeText=false) => dumpBoolean({
  value: value,
  trueWord: 'Enabled',
  falseWord: 'Disabled',
  includeText: includeText,
});

exports.dumpValidInvalid = (value, includeText=false) => dumpBoolean({
  value: value,
  trueWord: 'Valid',
  falseWord: 'Invalid',
  includeText: includeText,
});

exports.dumpOffOrValue = (value) => dumpBoolean({
  value: value,
  trueWord: value,
  falseWord: 'Off',
  includeText: true,
  noEmoji: true,
});
