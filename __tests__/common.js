const { faker } = require('@faker-js/faker');
const { Auth } = require('@vonage/auth');
const winston = require('winston');
const Transport = require('winston-transport');
const { format } = winston;
const { sep } = require('path');

class NullTransport extends Transport {
  log(_, callback) {
    callback();
  }
}

// This is a test key and is not assigned to a real account
const testPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArkfxVPGAqjGI/1B/8oQC
XLuek+0bzfw6hpkfKZ6egEuS6rFHBlvEwf9Grds8bxFZWf7m6+l9XwFI5kdrWXDr
IoApMP/7p1ga0u2IITtPXnpdFpZM0jJVkGrx61CDelgGZNPRfi4vzKtPW1L2y50q
7bDDz7pVofAQ1hK/9wADNAm6F/pKY1yb/3RIQ7bW25DKNJXlR2s6zIc5f9XV490c
1r9LDSRqewC4yodJPeENCaxUZ79OpCPeGd+q5TwvCe6wF63DiRZy4fzojX51k5p5
8DZbwsbxvghz/Dt63+SeNjGNiVUp4O96YgRwksywxPbNZbJzLqmOsqreYTFG9QLL
JwIDAQAB
-----END PUBLIC KEY-----`;

// This is a test key and is not assigned to a real account
// However it can be used to generate JWT tokens
const testPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCuR/FU8YCqMYj/
UH/yhAJcu56T7RvN/DqGmR8pnp6AS5LqsUcGW8TB/0at2zxvEVlZ/ubr6X1fAUjm
R2tZcOsigCkw//unWBrS7YghO09eel0WlkzSMlWQavHrUIN6WAZk09F+Li/Mq09b
UvbLnSrtsMPPulWh8BDWEr/3AAM0CboX+kpjXJv/dEhDttbbkMo0leVHazrMhzl/
1dXj3RzWv0sNJGp7ALjKh0k94Q0JrFRnv06kI94Z36rlPC8J7rAXrcOJFnLh/OiN
fnWTmnnwNlvCxvG+CHP8O3rf5J42MY2JVSng73piBHCSzLDE9s1lsnMuqY6yqt5h
MUb1AssnAgMBAAECggEABFZ1EBSstk+3pbHRZW4EswiBGL8eNzZvwc7eLYaC/RV5
yXlHwnBBSZolc7P7tpX7dS0jfpFYAKfYXSbqP0EmERHt3zLX3CE/awA6KFLravdn
tBAMnG9f8tFpRl6WzyeRYoFlJZtXruPqpzloPBwkJ+NY6aWCdnPdBL8AY9DubiVE
kC1fez1cfhm88wu1Hdf6woUh+R6vnIFlAnayGPYkM2S9X4xnrVWfLTrDlRf2NB2o
K3P8q3FgWAh4o9Jnl/DpI5euOsorwooIqMmYhK9DYaMsDmWrZLMOciSZJKn3xMtH
+LzMVQgVoc0LZCNA8vAxqefH6jjxzZkRiVuqU8eB5QKBgQDwR+YLwWXVkaLCtPOs
RnW+U6KRaZYYexCx7K8cH/HIZ/ZhYP1m9J0LSuOF6sKlmDOooaOqS62tBfWDRUut
4NHbzHi3iDhjRH2Mz1h9uRURzPld5TZkMdDVAHxkd4b5tN9u7c+1Y0WQ7mvEJS//
kDDhwNwR1+JiUIDYlPJSadbj6wKBgQC5rrZrlEGTApBoorjIWrUzTC99eBUas92C
BozwLHVB1FzDcBP9ABqee0fgVEND4i2iNZCtCm19Gsv+nd21+E1+wmhREBtCzEXO
wfQQjeOJN0QnjJKm94WSmx1xmkhIZBG7NRmScP2W0BzXdEkbRPfWpnfFmUqim2qH
/lTR139ytQKBgF6tBdD1+EkppEcyA52K+dPvomvHfdPRked5ihn74EoF5MfD7rUF
h2eur23R7bZP/XLhldqBDULSyUVbJZGytx3zOFGgxA8hKpM0E/sd1VZ5PHyp1z+t
fUqgcWMo0a9MfIl5/NDM99k+iIn12S7KwugBFPWW6eWxMMOmFMEyYPDXAoGAW3Z+
EPvUWS/YJlKRJs/Xlc8fTXSLIL4cjGHhpqSfla+fif15OxSECDC9tPiMsbGFvPMZ
ssMCL6+1cFQe0/XdZmUosVV3uC2a7T+Ik2bw/7QjdD/ANVKTjyWtGTpgBJiWS1ra
n9HceB9HNbHoGPCeDDOvp7vckcBwd1CGQ18dPkkCgYBwm8eIPoW92dOBvnZrh4WT
UBEEJoSmV7iom93Wt6m6u0Ow54JrhJeDpRH301OMU0V0UD4cQ7S4SxvVsFEjyGiO
thaTVNUBxf1N62zIzUL7t6ItA4+PZVu6ehXyZ/rax7DfhmINjQ3fRGPPLHGd0L1O
8B7ZcGqNJg+6nRv+fTwCjw==
-----END PRIVATE KEY-----
`;

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

const getLoggerMideleware = () => Object.freeze({
  ...testLogger,
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
});

const getLocalConfig = () => Object.freeze({
  apiKey: faker.string.alpha(16),
  apiSecret: faker.string.alpha(16),
  privateKey: `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`,
  appId: faker.string.uuid(),
});

const getGlobalConfig = () => Object.freeze({
  apiKey: faker.string.alpha(16),
  apiSecret: faker.string.alpha(16),
  privateKey: `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`,
  appId: faker.string.uuid(),
});

const getCLIConfig = () => Object.freeze({
  apiKey: faker.string.alpha(16),
  apiSecret: faker.string.alpha(16),
  privateKey: `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`,
  appId: faker.string.uuid(),
});

const getLocalFile = () => {
  const localPath = faker.system.directoryPath().replace(/\//g, sep);
  return Object.freeze({
    localConfigPath: localPath,
    localConfigFile: `${localPath}${sep}.vonagerc`,
    localConfigExists: true,
  });
};

const getGlobalFile = () => {
  const globalPath = faker.system.directoryPath().replace(/\//g, sep);
  return Object.freeze({
    globalConfigPath: globalPath,
    globalConfigFile: `${globalPath}${sep}config.json`,
    globalConfigExists: true,
  });
};

const getMiddlewareConfig = () => {
  return Object.freeze({
    ...getLocalFile(),
    ...getGlobalFile(),
    cli: getCLIConfig(),
    local: getLocalConfig(),
    global: getGlobalConfig(),
  });
};

const getConfigArgs = () => {
  const config = getMiddlewareConfig();
  return Object.freeze({
    config: config,
    appId: config.cli.appId,
    privateKey: config.cli.privateKey,
    apiKey: config.cli.apiKey,
    apiSecret: config.cli.apiSecret,
  });
};

const getTestMiddlewareArgs = () => {
  const base = getConfigArgs();
  return Object.freeze({
    ...base,
    logger: getLoggerMideleware(),
    auth: new Auth({
      appId: base.appId,
      privateKey: base.privateKey,
      apiKey: base.apiKey,
      apiSecret: base.apiSecret,
    }),
  });
};

module.exports = {
  getCLIConfig: getCLIConfig,
  getConfigArgs: getConfigArgs,
  getGlobalConfig: getGlobalConfig,
  getLocalConfig: getLocalConfig,
  getLocalFile: getLocalFile,
  getLoggerMideleware: getLoggerMideleware,
  getMiddlewareConfig: getMiddlewareConfig,
  getTestMiddlewareArgs: getTestMiddlewareArgs,
  getGlobalFile: getGlobalFile,
  testLogger: testLogger,
  testPrivateKey: testPrivateKey,
  testPublicKey: testPublicKey,
};
