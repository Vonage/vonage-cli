const jsonDiff = require('json-diff');

const status = {
  OK: 'OK',

  // Invalid means that the path is present in both but the values are different
  INVALID: 'INVALID',

  // Present that there is a difference between the token and the flag but
  // the validation is still considered a pass
  PASS: 'PASS',

  // Presnt in token
  PRESENT: 'PRESENT',

  // Missing in flag
  MISSING: 'MISSING',

  // Present in both but different
  MISMATCH: 'MISMATCH',
};

const getMethods = ({methods} = {}) => methods ? methods.join(', ') : 'ANY';

const determineStatus = (which, pathDiff) => {
  if (!pathDiff) {
    return status.OK;
  }

  if (pathDiff[`${which}__deleted`]) {
    return status.PRESENT;
  }

  if (pathDiff[`${which}__added`]) {
    return status.MISSING;
  }

  if (pathDiff[which]) {
    return status.MISMATCH;
  }

  return status.OK;
};

const processPathMethodsAndFilters = (diff, acc, path) => {
  if (!diff) {
    return;
  }

  const mismatchDiff = diff.paths[path];

  const filtersStatus = determineStatus('filters', mismatchDiff);
  const methodsStatus = determineStatus('methods', mismatchDiff);

  acc.paths[path].filtersStatus = filtersStatus;
  acc.paths[path].methodsStatus = methodsStatus;

  switch (true) {
  case methodsStatus === status.OK && filtersStatus === status.MISSING:
    acc.paths[path].state = status.PASS;
    break;

  case methodsStatus !== status.OK:
  case filtersStatus !== status.OK && filtersStatus !== status.MISSING:
  case filtersStatus === status.MISMATCH:
    acc.paths[path].state = status.INVALID;
    acc.ok = false;
  }
};

const processPath = (diff, acc, path) => {
  // JSON Diff will have the following structure becuase of the order
  // we are passing the token (first and then the flag)
  // This means that the diff will assume we want to match the flag to
  // the token.

  // If deleted then path is missing in flag but present in token
  if (diff?.paths[`${path}__deleted`]) {
    acc.paths[path].state = status.PRESENT;
    return acc;
  }

  // If added then path is missing in token but present in flag
  if (diff?.paths[`${path}__added`]) {
    acc.ok = false;

    acc.paths[path].state = status.MISSING;
    return acc;
  }

  // Now we know that the path is present in both the token and the flag
  // so we can compare the methods and filters
  processPathMethodsAndFilters(diff, acc, path);
  return acc;
};

const aclDiff = (tokenAcl, flagAcl) => {
  console.info('Comparing ACLs');

  const diff = jsonDiff.diff(tokenAcl, flagAcl);
  const merged = {paths: {...tokenAcl.paths, ...flagAcl.paths}};

  return Object.entries(merged.paths).reduce(
    (acc, [path]) => {
      acc.paths[path] = {
        // we always want to show what is in the token the user might not
        // know what is in the token
        methods: getMethods(flagAcl.paths[path]),

        methodsStatus: status.OK,

        filtersStatus: status.OK,

        state: status.OK,
      };

      processPath(diff, acc, path);
      return acc;
    },
    {ok: true, paths: {}},
  );
};

exports.aclDiff = aclDiff;
exports.status = status;
