exports.force = {
  alias: 'f',
  describe: 'Force the command to run without confirmation',
  type: 'boolean',
};

exports.yaml = {
  describe: 'Output as YAML',
  type: 'boolean',
  conflicts: 'json',
  group: 'Output:',
};

exports.json = {
  describe: 'Output as JSON',
  conflicts: 'yaml',
  type: 'boolean',
  group: 'Output:',
};
