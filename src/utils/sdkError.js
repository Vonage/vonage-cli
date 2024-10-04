const yargs = require('yargs');
exports.sdkError = async (error) => {
  const statusCode = error.response?.status;
  const errorData = await error.response?.json() || {};
  console.debug(JSON.stringify(errorData, null, 2));

  switch (statusCode) {
  case 401:
  case 403:
    console.error('You are not authorized to perform this action');
    yargs.exit(5);
    return;
  case 404:
    console.error(
      `Resource not Found${errorData.detail
        ? `: ${errorData.detail}`
        : ''}`,
    );
    yargs.exit(90);
    return;

  default:
    console.error(`Error with SDK call: ${error.message}` );
    yargs.exit(99);
    return;
  }
};
