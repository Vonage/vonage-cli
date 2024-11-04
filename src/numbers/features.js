const features = [
  'SMS',
  'MMS',
  'VOICE',
];

const coerceFeatures = (value) => {
  const argFeatures = value.split(',').map((feature) => String(feature).toUpperCase());

  const valid = argFeatures.every((feature) => features.includes(feature));

  if (!valid) {
    throw new Error(`Invalid features: ${argFeatures.join(', ')}`);
  }

  return argFeatures;
};

const featureFlag = {
  description: 'Available features are SMS, VOICE and MMS. To look for numbers that support multiple features, use a comma-separated value: SMS,MMS,VOICE.',
  type: 'string',
  coerce: coerceFeatures,
};

exports.featureFlag = featureFlag;

exports.features = features;

exports.coerceFeatures = coerceFeatures;
