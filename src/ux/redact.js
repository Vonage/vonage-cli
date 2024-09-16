const redact = (text) => text
  ? `${text}`.substring(0, 3) + '*'.repeat(`${text}`.length - 2)
  : null;

exports.redact = redact;
