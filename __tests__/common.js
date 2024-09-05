const { faker } = require('@faker-js/faker');
const { Auth } = require('@vonage/auth');
const winston = require('winston');
const Transport = require('winston-transport');
const { format } = winston;

class NullTransport extends Transport {
  log(_, callback) {
    callback();
  }
}

// This is a test key and is not assigned to a real account
// However it can be used to generate JWT tokens
const testPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDTH8cEhJKsu2hB
ucgs0Blf3tvgdXuIa5sMRI3zIZGok8jqaj6DC0WdM1eiJlQCWnVL0vR25MkopMZN
MTphoaVpdK9wywMVx7PsgMCDXJjW77QFJFbbcbV9KG2xvMsjJGttmVrn+9aPpCnX
yT27bWkTR0k/wCAvra/st5MDKg2kB3SMc+97zlO3GqIkJJKfKYQFAO8oRBcsZ1Bx
ydPWTQvyLYW15Cjv30aIGLfceFwDeUOBgBsesGFtcXvVF6sVxd5D/USunX/9es95
Rdr4+9Qq4tIKZRkBz2KWD0eo256wmmq2lQoGaR9x6XgLHhUlsi6OXILcyChi2Qcc
a01Hn7YvAgMBAAECggEAJsS+lIdNsddmIS+e4Q/DoRW49aJNMXNlEN8j2+Itr7GX
ougom4K94UyUyotUQOxgfrB5wL1pbQO5AGLKUDRRPii1sLYu1liKIyNPdq/RxyJU
Qd927awXQiji39EF0mm1KnaPOWtG7rCcGGp1Yg4Izgf4nPLIVkkENalOHzYhNB3u
4W4OIT49iw/auBF4wnl1RmXWXjkxDuk2cYT28a8hWqyQjJqXTsO+u4BaXYxSf4nP
Be2yoUEFRbcxvJrhEpfODhPP83I1EBipJkhUTc5WMb/vtH2b49+TYd2tPR0LOxom
mcNUWF6++ae+vL6K8Dlfcvx+CA7g7KBHHcgFCzn7GQKBgQDzc2ow5LlQQ/VfXZTz
n07V/QgVQ15sA5Cf/gsvmwnGPy06Qx/WRHsz6NG8nvW2mHZwfDIHuLjBW1gcssEx
mLpqav5XLZfSyjjRO/AxLIfJDx/aARp3+7Ny5aY2e3wtNx8wz4J80i7P+eX3fETM
70cWhc2PvYMDjG+O7cDW2FWAFwKBgQDeAcc/FBHLl9/HqiBvYf/Y/k0t1TUoHujO
PSbP6SaN06JnvJmBANyED7sWeIPuoRFXXEr4Auu7y0C55Wlsno/ImTbJsopZ1rgU
k5q4t9vcu7cGiOr7L7UkySNYZqRjwvKEJ610COexTThSwl0v3GNLP8r4AMdBaqdK
uO6fVfxxqQKBgFc5ne2Atai9gJe3ltum0382FoRPy+/VYyb/xZA780eVcSXz0N9b
T+0sWKFFLvJKM/1fcil0FLYqfSpjHXcgqoHgbdpcWo5KqArHd+qWctwl0Bqy1IHy
q7vZ7jCNE9O7cTBy2OTSBbW8apm+a4Qlowm9zQXYN624zmueYb5YamHnAoGAZvJA
KHnv/o7AkF/NhpjVARR7SYOSkLY0kl48/zBIVoAK0TvdmrqBhyOcR8E+vIsn9XCw
uuzvzzdjHlDJYDruxcB2bXVDPoGY/sGrf3iSlXreVkNrY2st/o7euwFtvW0K9ElJ
34K5nbgHJClI+QajbKN6RSJnQ2hnhvjWfkBrPXECgYEA4MCEm9EyrguEO51am8va
OjIAiQMkj/iyjsMDL8eH0VM+OMdieHwbkKyajyrB9dFikvWfxiuo3dU1N5vJTzty
LmzkB8M/rKlAYKD8iKA8cRun4tKzRepHT3JPMu0GYTfcP9ovs5F3aEjX+UuWOO7n
doWDENAr/VU1RNCDwFdxYFg=
-----END PRIVATE KEY-----`;


exports.testPrivateKey = testPrivateKey;

const testLogger = winston.createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.padLevels(),
    format.simple(),
  ),
  transports: [new NullTransport()],
});

exports.testLogger = testLogger;

const getLoggerMideleware = () => Object.freeze({
  ...testLogger,
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
});

exports.getLoggerMideleware = getLoggerMideleware;

const getLocalConfig = () => Object.freeze({
  apiKey: faker.string.alpha(16),
  apiSecret: faker.string.alpha(16),
  privateKey: `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`,
  appId: faker.string.uuid(),
});

exports.getLocalConfig = getLocalConfig;

const getGlobalConfig = () => Object.freeze({
  apiKey: faker.string.alpha(16),
  apiSecret: faker.string.alpha(16),
  privateKey: `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`,
  appId: faker.string.uuid(),
});

exports.getGlobalConfig = getGlobalConfig;

const getCLIConfig = () => Object.freeze({
  apiKey: faker.string.alpha(16),
  apiSecret: faker.string.alpha(16),
  privateKey: `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`,
  appId: faker.string.uuid(),
});

exports.getCLIConfig = getCLIConfig;

const getMiddlewareConfig = () => {
  const localPath = faker.system.directoryPath();
  const globalPath = faker.system.directoryPath();
  return Object.freeze({
    localConfigPath: localPath,
    localConfigFile: `${localPath}/.vonagerc`,

    globalConfigPath: globalPath,
    globalConfigFile: `${globalPath}/.vonagerc`,

    cli: getCLIConfig(),
    local: getLocalConfig(),
    global: getGlobalConfig(),
  });
};

exports.getMiddlewareConfig = getMiddlewareConfig;

const getConfigArgs = () => {
  const config = getMiddlewareConfig();
  return Object.freeze({
    config: config,
    logger: getLoggerMideleware(),
    appId: config.cli.appId,
    privateKey: config.cli.privateKey,
    apiKey: config.cli.apiKey,
    apiSecret: config.cli.apiSecret,
  });
};

exports.getConfigArgs = getConfigArgs;

const getTestMiddlewareArgs = () => {
  const base = getConfigArgs();
  return Object.freeze({
    ...base,
    auth: new Auth({
      appId: base.appId,
      privateKey: base.privateKey,
      apiKey: base.apiKey,
      apiSecret: base.apiSecret,
    }),
  });
};

exports.getTestMiddlewareArgs = getTestMiddlewareArgs;

