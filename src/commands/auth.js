exports.command = 'auth [command]';

exports.desc = 'View auth information';

exports.builder = (yargs) => yargs.options({
  'yaml': {
    describe: 'Output as YAML',
    type: 'boolean',
    conflicts: 'json',
  },
  'json': {
    describe: 'Output as JSON',
    type: 'boolean',
    conflicts: 'yaml',
  },
}).commandDir('auth');

exports.handler = async (argv) => {
  console.info('Displaying authentication information');
};
