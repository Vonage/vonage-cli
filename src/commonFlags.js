export const force = {
  alias: 'f',
  describe: 'Force the command to run without confirmation',
  type: 'boolean',
};

export const yaml = {
  describe: 'Output as YAML',
  type: 'boolean',
  conflicts: 'json',
  group: 'Output:',
};

export const json = {
  describe: 'Output as JSON',
  conflicts: 'yaml',
  type: 'boolean',
  group: 'Output:',
};
