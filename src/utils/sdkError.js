const yargs = require('yargs');
exports.sdkError = async (error) => {
  const statusCode = error.response?.status;
  console.debug(JSON.stringify(await error.response.json(), null, 2));

  switch (statusCode) {
  case 401:
  case 403:
    console.error('You are not authorized to perform this action');
    yargs.exit(5);
    return;

  default:
    console.error(`With SDK call: ${error.message}` );
    yargs.exit(99);
    return;
  }
};
