const typeLabels = {
  'landline': 'Landline',
  'landline-toll-free': 'Toll-free',
  'mobile-lvn': 'Mobile',
};

const types = Object.keys(typeLabels);

const typeFlag = {
  description: 'Type of phone number',
  type: 'string',
  choices: types,
};

exports.typeFlag = typeFlag;

exports.typeLabels = typeLabels;

exports.types = types;

