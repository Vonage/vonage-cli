const unsetRemove = (obj, setAsNull=false) => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value === '__REMOVE__' && !setAsNull) {
        return acc;
      }

      if (typeof value === 'object' && value !== null) {
        return {
          ...acc,
          [key]: unsetRemove(value),
        };
      }

      return {
        ...acc,
        [key]: value === '__REMOVE__' ? null : value,
      };
    },
    {},
  );
};

exports.unsetRemove = unsetRemove;

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
