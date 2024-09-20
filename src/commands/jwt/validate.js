const { aclDiff } = require('../../utils/aclDiff');
const { dumpAclDiff } = require('../../ux/dumpAcl');
const { indentLines } = require('../../ux/indentLines');
const jwt = require('jsonwebtoken');
const { dumpObject } = require('../../ux/dump');
const { dumpBoolean } = require('../../ux/dumpYesNo');
const { jwtFlags } = require('./create');
const yargs = require('yargs');

class ExpiredTokenError extends Error {
  constructor() {
    super('Token has expired or is not yet active');
  }
}

class InvalidClaimError extends Error {
  _which;

  static invlidClaims = {
    APP_ID: 'application_id',
    SUB: 'sub',
    ACL: 'acl',
  };

  constructor(which, message) {
    super(message);
    this.name = 'InvalidClaimError';
    this._which = which;
  }
}

const validateAppId = (decoded, argv) => {
  const decodedApp = decoded.application_id || false;
  const argvApp = argv.appId;
  console.debug(`Validating application id: ${decodedApp} equals ${argvApp}`);

  switch (true) {
  case (!decodedApp):
    console.log('❌ Application Id is not present in the token');
    throw new Error('Application Id is not present in the token');

  case (decodedApp === argvApp):
    console.log(`✅ Application Id [${decoded.application_id}] matches [${argv.appId}]`);
    return;
  default:
    console.log(`❌ Application Id [${decoded.application_id}] does not match [${argv.appId}]`);
    throw new InvalidClaimError(InvalidClaimError.invlidClaims.APP_ID, `Subject [${decoded.sub}] does not match [${argv.sub}]`);
  }
};

const validateSubject = (decoded, argv) => {
  const decodedSub = decoded.sub || false;
  const argvSub = argv.sub || false;
  console.debug(`Validating subject: [${decoded.sub}] equals [${argv.sub}]`);

  switch (true) {
  case (!decodedSub && !argvSub):
    console.debug('Subject not passed as argument and not present in the token');
    return;

  case (decodedSub && !argvSub):
    console.log(`ℹ️ Subject [${decoded.sub}]`);
    return;

  case (decodedSub === argvSub):
    console.log(`✅ Subject [${decoded.sub}] matches [${argv.sub}]`);
    return;

  default:
    console.log(`❌ Subject [${decoded.sub}] does not match [${argv.sub}]`);
    throw new InvalidClaimError(InvalidClaimError.invlidClaims.SUB, `Subject [${decoded.sub}] does not match [${argv.sub}]`);
  }
};

const validateExpired = (decoded) => {
  if (!decoded.exp) {
    console.warn('Token does not have an expiry date. It is good practice to include one.');
    return;
  }

  const now = parseInt(Date.now());
  const expiry = new Date(decoded.exp * 1000);

  console.debug(`Token is not valid after ${new Date(expiry).toISOString()}. Current time is ${new Date(now).toISOString()}`);

  if (now < expiry) {
    console.log('✅ Token has not expired');
    return;
  }

  console.log('❌ Token has expired');
  throw new ExpiredTokenError();
};

const validateNotBefore = (decoded) => {
  if (!decoded.nbf) {
    console.debug('Token does not have a not before time');
    return;
  }

  const now = parseInt(Date.now());
  const nbf = new Date(decoded.nbf * 1000);

  console.debug(`Token is not valid before ${new Date(nbf).toISOString()}. Current time is ${new Date(now).toISOString()}`);

  if (now > nbf) {
    console.log('✅ Token not before time is valid');
    return;
  }

  console.log('❌ Token is not yet valid');
  throw new ExpiredTokenError();
};

const validateAcl = (decoded, argv) => {
  const actualAcl = decoded.acl || false;
  let expectedAcl = argv.acl || false;

  const aclFlag = !!argv.acl || false;
  console.debug('Validating ACL', actualAcl, expectedAcl);
  if (!actualAcl && !expectedAcl) {
    console.debug('ACL not passed as argument and not present in the token');
    return;
  };

  if(!expectedAcl) {
    console.warn('ACL is present in the token but not in the validation arguments');
    expectedAcl = actualAcl;
  }

  // Run the diff so we can dump the acl results info
  const results = aclDiff(actualAcl, expectedAcl);

  console.log(!aclFlag
    ? 'ℹ️ ACL present'
    : dumpBoolean({
      value: results.ok,
      trueWord: 'ACL matches',
      falseWord: 'ACL does not match',
      includeText: true,
    }),
  );

  console.log(indentLines(dumpAclDiff(results, !aclFlag), 2));
};

exports.command = 'validate <token>';

exports.desc = 'Validate a JWT token';

exports.builder = {
  sub: jwtFlags.sub,
  acl: jwtFlags.acl,
};

exports.handler = (argv) => {
  console.info('Validating JWT token');
  const decoded = jwt.verify(
    argv.token,
    argv.privateKey,
    {
      algorithms: ['RS256'],
      ignoreExpiration: true,
      ignoreNotBefore: true,
    },
  );

  console.debug(`Decoded token: ${dumpObject(decoded)}`);
  console.log('✅ Token was signed with the correct private key');

  try {
    validateExpired(decoded);
    validateNotBefore(decoded);
    validateAppId(decoded, argv);
    validateSubject(decoded, argv);
    validateAcl(decoded, argv);
    console.log('✅ All checks complete! Token is valid');
  } catch (error) {
    switch (error.constructor.name) {
    case 'InvalidClaimError':
      yargs.exit(22);
      break;

    case 'ExpiredTokenError':
      yargs.exit(127);
      break;
    }
  }

};
