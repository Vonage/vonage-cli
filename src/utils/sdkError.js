const yargs = require('yargs');
exports.sdkError = async (error) => {
  const statusCode = error.response?.status;
  let errorData = {};
  try {
    errorData = await error.response?.json();
  } catch (error) {
    console.debug('Failed to parse error response', error);
  }

  console.debug(JSON.stringify(errorData, null, 2));
  console.debug(`Status Code ${statusCode}`);

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
    yargs.exit(20);
    return;

  default:
    console.error(`Error with SDK call: ${error.message}` );
    yargs.exit(99);
    return;
  }
};
