exports.command = 'init [dir]';
exports.desc = 'Create an empty repo';
exports.builder = {
  dir: {
    default: '.'
  }
};
exports.handler = (argv) => {
  console.log('init called for dir', argv);
};
