const jwt = require('jsonwebtoken');
const { dumpObject } = require('../../ux/dump');
const { jwtFlags } = require('./create');

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
    throw new Error(`Application Id [${decoded.application_id}] does not match [${argv.appId}]`);
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
    console.warn('Subject is present in the token but not in the validation arguments');
    return;

  case (decodedSub === argvSub):
    console.log(`✅ Subject [${decoded.sub}] matches [${argv.sub}]`);
    return;

  default:
    console.log(`❌ Subject [${decoded.sub}] does not match [${argv.sub}]`);
    throw new Error(`Subject [${decoded.sub}] does not match [${argv.sub}]`);
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
  throw new Error('Token has expired');
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
  throw new Error('Token is not yet valid');
};

const validateAcl = (decoded, argv) => {
  const decodedAcl = decoded.acl || false;
  const argvAcl = argv.acl || false;
  console.debug('Validating ACL', decodedAcl, argvAcl);

  switch (true) {
  case(!decodedAcl && !argvAcl):
    console.debug('ACL not passed as argument and not present in the token');
    return;

  case (decodedAcl && !argvAcl):
    console.warn('ACL is present in the token but not in the validation arguments');
    return;

  case (JSON.stringify(decoded.acl) === JSON.stringify(argv.acl)):
    console.log('✅ ACL matches');
    return;
  default:
    console.log('❌ ACL does not match');
    throw new Error('ACL does not match');
  }
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

  validateExpired(decoded);
  validateNotBefore(decoded);
  validateAppId(decoded, argv);
  validateSubject(decoded, argv);
  validateAcl(decoded, argv);

  console.log('✅ All checks complete! Token is valid');
};
