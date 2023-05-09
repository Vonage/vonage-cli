const acl = {
  paths: {
    '/*/users/**': {},
    '/*/conversations/**': {},
    '/*/sessions/**': {},
    '/*/devices/**': {},
    '/*/image/**': {},
    '/*/media/**': {},
    '/*/applications/**': {},
    '/*/push/**': {},
    '/*/knocking/**': {},
    '/*/legs/**': {},
  },
};
export default [
  {
    label: 'create JWT',
    commandArgs: [],
    expectedClaims: {
      application_id: 'env-app-id',
    },
    includeExpire: false,
  },
  {
    label: 'create JWT with custom app-id',
    commandArgs: ['--app-id=my-app'],
    expectedClaims: {
      application_id: 'my-app',
    },
    includeExpire: false,
  },
  {
    label: 'create JWT with subject',
    commandArgs: ['--subject=history of the world'],
    expectedClaims: {
      application_id: 'env-app-id',
      sub: 'history of the world',
    },
    includeExpire: false,
  },
  {
    label: 'create JWT with acl',
    commandArgs: [`--acl=${JSON.stringify(acl)}`],
    expectedClaims: {
      application_id: 'env-app-id',
      acl: JSON.stringify(acl),
    },
    includeExpire: false,
  },
  {
    label: 'create JWT with custom expires',
    commandArgs: ['--exp=1980820800'],
    expectedClaims: {
      application_id: 'env-app-id',
      exp: 1980820800,
    },
    includeExpire: true,
  },
];
