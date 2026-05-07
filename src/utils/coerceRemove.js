const unsetRemove = (obj, setAsNull = false) => {
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

export { unsetRemove };

export const coerceRemove = (arg) => {
  if (arg === '') {
    return '__REMOVE__';
  }

  return arg;
};

export const coerceRemoveCallback = (cb) => (arg) => {
  if (arg === '') {
    return '__REMOVE__';
  }

  return cb(arg);
};

export const coerceRemoveList = (flagName, list) => (arg) => {
  if (arg === '') {
    return '__REMOVE__';
  }

  if (list.includes(arg)) {
    return arg;
  }

  throw new Error(`Invalid value [${arg}] for ${flagName}, only ${list.join(', ')} are supported.`);
};

export const clearRemoved = (obj) => Object.fromEntries(Object.entries(obj).reduce(
  (acc, [key, value]) => {
    if (value?.constructor.name === 'Object') {
      acc.push([key, clearRemoved(value)]);
      return acc;
    };

    if (value !== '__REMOVE__') {
      acc.push([key, value]);
    }

    return acc;
  },
  [],
));

