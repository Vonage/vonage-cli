const { validateApplicationKey } = require('../../utils/validateSDKAuth');
const { capabilities, capabilityLabels, getAppCapabilities } = require('../../apps/capabilities');
const { dumpEnabledDisabled, dumpBoolean, dumpValidInvalid } = require('../../ux/dumpYesNo');
const { loadOwnedNumbersFromSDK } = require('../../numbers/loadOwnedNumbersFromSDK');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { apiKey, apiSecret, privateKey } = require('../../credentialFlags');
const yargs = require('yargs');
const { dumpCommand } = require('../../ux/dump');

const flagGroup = 'Application Validation';

exports.description = 'Validate an application';

exports.command = 'validate <id>';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application to validate',
    },
  )
  .options({
    'private-key-file': {
      ...privateKey,
      describe: 'Validate this private key is paired with the application',
    },
    'messages': {
      describe: 'Confrim the application has the messages capability enabled',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'voice': {
      describe: 'Confrim the application has the voice capability enabled',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'rtc': {
      describe: 'Confrim the application has the RTC capability enabled',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'video': {
      describe: 'Confrim the application has the video capability enabled',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'network': {
      describe: 'Confrim the application has the Netwokr APIs capability enabled',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'verify': {
      describe: 'Confrim the application has the Verify capability enabled',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'vbc': {
      describe: 'Confrim the application has the VBC capability enabled',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'all': {
      describe: 'Confrim the application has all capabilities',
      type: 'boolean',
      default: false,
      group: flagGroup,
    },
    'linked-numbers': {
      describe: 'Validate the application has these numbers linked',
      type: 'string',
      group: flagGroup,
      /* istanbul ignore next */
      coerce: (numbers) => numbers.split(','),
    },
    'api-key': apiKey,
    'api-secret': apiSecret,
  })
  .epilogue([
    'The validate command checks an application for the following (at least one check must be provided:',
    '  1. The application has the correct public key by matching it with the private key provided',
    '  2. The application has the specified capabilities',
    '  3. The application has the specified linked numbers',
    '',
    'This command will exit with the following codes:',
    '  Exit 10 if the private key does not match the public key',
    '  Exit 5 will be returned if the application is missing any of the specified capabilities',
    '  Exit 2 will be returned if the application is missing any of the specified linked numbers',
    '  Exit 15 will be returned if the application is missing messages or voice capabilities and has numbers linked to it',
  ].join('\n'))
  .example(
    dumpCommand('vonage apps validate 000[...]000 --private-key=./path/to/private.key'),
    'Validate application has the correct private key',
  )
  .example(
    dumpCommand('vonage apps validate 000[...]000 --messages --voice'),
    'Validate application has messages and voice capabilities',
  )
  .example(
    dumpCommand('vonage apps validate 000[...]000 --linked-numbers=19162255887,12127779311'),
    'Validate application has the specified linked numbers',
  );

const appHasCapability = (capability, app) => getAppCapabilities(app).includes(capability);

const checkCapability = (capability, app) => {
  const checkCapability = capability === 'network_apis' ? 'network' : capability;
  console.debug(`Checking capability ${checkCapability}`);

  const hasCapability = appHasCapability(checkCapability, app);
  console.log(
    `Application has ${capabilityLabels[capability]} capability: ${dumpEnabledDisabled(hasCapability, true)}`,
  );

  return hasCapability;
};

const dumpConfig = {
  trueWord: 'Linked',
  falseWord: 'Not linked',
  includeText: true,
};

exports.handler = async (argv) => {
  const { id, SDK, linkedNumbers } = argv;
  console.info(`Validating application ${id}`);

  const application = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );

  console.debug(`Application ${application.name} loaded`);
  let allCapabilitiesValid = true;
  let numbersOk =  true;

  const { numbers } = await loadOwnedNumbersFromSDK(
    SDK,
    {
      id: application.id,
      message: `Fetching numbers linked to application: ${application.name}`,
      all: true,
    },
  );

  const appNumbers = numbers.map(({msisdn}) => msisdn);
  if (linkedNumbers) {
    console.info('Fetching numbers linked to application');

    console.debug('Application numbers', appNumbers);
    numbersOk = linkedNumbers.every((number) => {
      const numberIncluded = appNumbers.includes(number);
      console.log(`Checking if application has number ${number}: ${dumpBoolean({value: numberIncluded, ...dumpConfig})}`);
      return numberIncluded;
    });
  }

  console.log('');
  let correctPublicKey = true;

  if (argv.privateKeyFile) {
    console.info('Validating public key');
    correctPublicKey = validateApplicationKey(application, argv.privateKeyFile);
    console.log(`Checking private and public key: ${dumpValidInvalid(correctPublicKey, true)}`);
  };

  const appCapabilities = getAppCapabilities(application);

  console.debug('Application capabilities', appCapabilities);

  const capabilitiesToValidate = capabilities.filter((capability) => argv.all
    || argv[capability]
    || (capability === 'network_apis' && argv['network']),
  );

  console.debug(`Validating capabilities [${capabilitiesToValidate}]`);

  for(const capability of capabilitiesToValidate) {
    allCapabilitiesValid = checkCapability(capability, application) && allCapabilitiesValid;
  }

  if (!correctPublicKey) {
    console.error('Application has incorrect public key');
    yargs.exit(10);
    return;
  }

  if (!allCapabilitiesValid) {
    console.error('Application is missing capabilities');
    yargs.exit(5);
    return;
  }

  if (!numbersOk) {
    console.error('Application is missing linked numbers');
    yargs.exit(2);
    return;
  }

  if (argv.linkedNumbers
    && !(appHasCapability('messages', application)
      || appHasCapability('voice', application))
  ) {
    console.error('Application has numbers linked but is missing messages or voice capabilities');
    yargs.exit(15);
    return;
  }

  console.log('Application validation passed ✅');
};
