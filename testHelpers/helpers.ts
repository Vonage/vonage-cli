import path from 'node:path';
import url from 'node:url';

// Set these here to ensure calls to API will fail
process.env.VONAGE_API_KEY = 'env-key';
process.env.VONAGE_API_SECRET = 'env-secret';
process.env.VONAGE_PRIVATE_KEY = 'env-private-key';
process.env.VONAGE_APPLICATION_ID = 'env-app-id';

// Make sure we do not load am actual config file
process.env.XDG_CONFIG_HOME = `${process.cwd()}/test`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockableFunction = (...args: any[]) => any

export const asMock = <Func extends MockableFunction>(mockedFunc: Func) =>
  mockedFunc as jest.MockedFunction<typeof mockedFunc>;

export const keyFile = `${path.dirname(url.fileURLToPath(import.meta.url))}/private.test.key`;
