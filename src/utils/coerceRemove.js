exports.coerceRemove = (arg) => {
  if (arg === '') {
    return '__REMOVE__';
  }

  return arg;
};

exports.coerceRemoveCallback = (cb) => (arg) => {
  if (arg === '') {
    return '__REMOVE__';
  }

  return cb(arg);
};

exports.coerceRemoveList = (flagName, list) => (arg) => {
  if (arg === '') {
    return '__REMOVE__';
  }

  if (list.includes(arg)) {
    return arg;
  }

  throw new Error(`Invalid value [${arg}] for ${flagName}, only ${list.join(', ')} are supported.`);
};
