const { tokenGenerate } = require('@vonage/jwt');
const { dumpCommand } = require('../../ux/dump');
const Ajv = require('ajv/dist/2020');
const schema = require('../../aclSchema.json');
const { appId, privateKey } = require('../../credentialFlags');

const ajv = new Ajv();
const validate = ajv.compile(schema);

const validateAcl = (arg) => {
  let acl;
  try {
    acl = JSON.parse(arg);
  } catch (error) {
    throw new Error(`Failed to parse JSON for ACL: ${error}`);
  }

  const data = validate(acl);
  if (data) {
    return acl;
  }

  // TODO Dump to debug log
  throw new Error(
    `ACL Failed to validate against schema:\n${JSON.stringify(validate.errors, null, 2)}`,
  );
};

const jwtFlags = {
  exp: {
    number: true,
    describe: 'The timestamp the token expires',
    group: 'JWT Options:',
    coerce: (arg) => parseInt(arg, 10),
  },
  ttl: {
    number: true,
    describe: 'The time to live in seconds',
    group: 'JWT Options:',
    coerce: (arg) => parseInt(arg, 10),
  },
  sub: {
    string: true,
    group: 'JWT Options:',
    describe: 'The subject of the token',
  },
  acl: {
    string: true,
    group: 'JWT Options:',
    describe: 'The access control list for the token',
    coerce: validateAcl,
  },
  'app-id': appId,
  'private-key': privateKey,
};

exports.jwtFlags = jwtFlags;

exports.command = 'create';

exports.description = 'Create a JWT token for authentication';

exports.builder = (yargs) => yargs.options(jwtFlags)
  .example(
    dumpCommand('$0 jwt create'),
    'Create a token using the configured private key and application id',
  )
  .example(
    dumpCommand('$0 jwt create --exp 3600 --ttl 600 --sub my-subject'),
    'Create a token with a 1 hour expiry, 10 minute TTL and subject "my-subject"',
  )
  .example(
    dumpCommand('$0 jwt create --app-id 000[...]000 --private-key ./path/to/private.key'),
    'Create a token with a different application id and private key',
  )
  .epilogue([
    '',
    'By default, the private key and application id from the config will be used.',
    `Use ${dumpCommand('vonage auth show')} check what those values are.`,
    '',
    `If you want to create a token with a different private key or application id, you can use the ${dumpCommand('--private-key')} and ${dumpCommand('--app-id')} flags to overwrite.`,
  ].join('\n'));

exports.handler = (argv) => {
  console.info('Creating JWT token');

  console.debug(`App ID: ${argv.appId}`);
  console.debug(`Expiry: ${argv.exp}`);
  console.debug(`TTL: ${argv.ttl}`);
  console.debug(`Subject: ${argv.sub}`);
  console.debug(`ACL: ${argv.acl}`);
  console.debug(`Claims: ${argv.claim}`);

  const token = tokenGenerate(
    argv.appId,
    argv.privateKey,
    {
      acl: argv.acl,
      exp: argv.exp,
      ttl: argv.ttl,
      sub: argv.sub,
    },
  );

  console.log(token);
};
