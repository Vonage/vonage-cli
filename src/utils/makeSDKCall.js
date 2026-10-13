import { spinner } from '../ux/spinner.js';
import { sdkError } from '../utils/sdkError.js';

export const makeSDKCall = async (sdkFn, loadingMessage, ...params) => {
  console.debug(`Calling SDK function ${sdkFn.name}`);
  const { stop: loadStop, fail: loadFail } = spinner({ message: loadingMessage });
  try {
    const result = await sdkFn(...params);
    console.debug('SDK function result', result);
    loadStop();
    return result;
  } catch (error) {
    loadFail();
    await sdkError(error);
    return;
  }
};
