const { validateApplicationKey } = require('../../utils/validateSDKAuth');
const { coerceKey } = require('../../utils/coerceKey');
const { capabilities, capabilityLabels, getAppCapabilities } = require('../../apps/capabilities');
const { dumpEnabledDisabled, dumpBoolean, dumpValidInvalid } = require('../../ux/dumpYesNo');
const { loadOwnedNumbersFromSDK } = require('../../numbers/loadOwnedNumbersFromSDK');
const { loadAppFromSDK } = require('../../apps/loadAppFromSDK');
const yargs = require('yargs');

const flagGroup = 'Application Validation';

exports.description = 'Validate an application';

exports.command = 'validate <id>';

exports.builder = (yargs) => yargs.options({
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
    coerce: (numbers) => numbers.split(','),
  },
  'key': {
    type: 'string',
    group: flagGroup,
    describe: 'Check private key against applications public key',
    coerce: coerceKey('private'),
  },
  // Flags from higher level that do not apply to this command
  'app-id': {
    hidden: true,
  },
  'app-name': {
    hidden: true,
  },
  'capability': {
    hidden: true,
  },
})
  .positional(
    'id',
    {
      describe: 'The ID of the application to show',
    },
  );

const checkCapability = (capability, appCapabilities) => {
  const checkCapability = capability === 'network_apis' ? 'network' : capability;
  console.debug(`Checking capability ${checkCapability}`);

  const hasCapability = appCapabilities.includes(checkCapability);
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

  const application = await loadAppFromSDK(SDK, id);

  if (!application) {
    return;
  }

  console.debug(`Application ${application.name} loaded`);
  let allCapabilitiesValid = true;
  let appNumbers = [];

  if (linkedNumbers) {
    console.info('Fetching numbers linked to application');
    appNumbers = await loadOwnedNumbersFromSDK(
      SDK,
      {
        appId: application.id,
        message: `Fetching numbers linked to application: ${application.name}`,
        all: true,
      },
    );
  }

  console.log('');
  let correctPublicKey = true;

  if (argv.key) {
    console.info('Validating public key');
    correctPublicKey = validateApplicationKey(application, argv.key);
    console.log(`Checking public key: ${dumpValidInvalid(correctPublicKey, true)}`);
  };

  const appCapabilities = getAppCapabilities(application);

  console.debug(`Application capabilities ${appCapabilities}`);

  const capabilitiesToValidate = capabilities.filter((capability) => argv.all 
    || argv[capability] 
    || (capability === 'network_apis' && argv['network']),
  );

  console.debug(`Validating capabilities [${capabilitiesToValidate}]`);

  for(const capability of capabilitiesToValidate) {
    allCapabilitiesValid = checkCapability(capability, appCapabilities)&& allCapabilitiesValid;
  }

  const numbersOk = linkedNumbers.every((number) => {
    console.info(`Checking if application has number ${number}`);
    const numberIncluded = appNumbers.includes(number);
    console.log(`Checking if application has number ${number}: ${dumpBoolean({value: numberIncluded, ...dumpConfig})}`);  
    return numberIncluded;
  });

  if (!allCapabilitiesValid || !numbersOk || !correctPublicKey) { 
    console.error('Application validation failed');
    yargs.exit(2);
    return;
  }

  console.log('Application validation passed ✅');
};
