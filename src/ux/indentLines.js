exports.indentLines = (str, length=2) => str
  ? str.split('\n')
    .map((line) => ' '.repeat(length) + line)
    .join('\n')
  : str;
