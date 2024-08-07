exports.setupLog = async (argv) => {
  if (!argv.verbose && !argv.debug) {
    console.info = () => {};
  }

  if (!argv.debug) {
    console.debug = () => {};
  }
};
