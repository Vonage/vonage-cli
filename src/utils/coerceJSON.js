const Ajv = require('ajv/dist/2020');
const ajv = new Ajv();

const coerceJSON = (argName, schema) => (json) => {
  let arg;
  try {
    arg = JSON.parse(json);
  } catch (error) {
    throw new Error(`Failed to parse JSON for ${argName}: ${error}`);
  }

  if (!schema) {
    return arg;
  }

  const validate = ajv.compile(schema);

  const data = validate(arg);
  if (data) {
    return arg;
  }

  // TODO Dump to debug log
  throw new Error(
    `${argName} Failed to validate against schema:\n${JSON.stringify(validate.errors, null, 2)}`,
  );
};

exports.coerceJSON = coerceJSON;
