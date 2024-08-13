const dumpBolean = (value, trueWord, falseWord, includeText=false) => value
  ? `✅ ${includeText ? trueWord : ''}`
  : `❌ ${includeText ? falseWord : ''}`;

exports.dumpBolean = dumpBolean;

exports.dumpYesNo = (value, includeText=false) => dumpBolean(
  value,
  'Yes',
  'No',
  includeText,
);

exports.dumpOnOf = (value, includeText=false) => dumpBolean(
  value,
  'On',
  'Off',
  includeText,
);

exports.dumpEnabledDisabled = (value, includeText=false) => dumpBolean(
  value,
  'Enabled',
  'Disabled',
  includeText,
);



