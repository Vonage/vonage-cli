exports.truncate = (arg, length=20, truncateWord='') => `${arg}`.substring(0, length) + truncateWord;
