// Allows for adding min/max constraints to number arguments
const coerceNumber = (argName, {min, max} = {}) => (value) => {
  if (value === undefined) {
    return value;
  }

  const number = Number(value);
  if (isNaN(number)) {
    throw new Error(`Invalid number for ${argName}: ${value}`);
  }

  if (min !== undefined && number < min) {
    throw new Error(`Number for ${argName} must be at least ${min}: ${value}`);
  }

  if (max !== undefined && number > max) {
    throw new Error(`Number for ${argName} must be at most ${max}: ${value}`);
  }

  return number;
};

exports.coerceNumber = coerceNumber;
