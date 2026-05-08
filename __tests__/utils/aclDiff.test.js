import { aclDiff, status } from '../../src/utils/aclDiff.js';
import { dumpAclDiff } from '../../src/ux/dumpAcl.js';

describe('Utils: ACL Diff', () => {
  test('Will pass when path in token and acl match', () => {
    const tokenAcl = {
      'paths': {
        '/*/rtc/**': {},

        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const flagAcl = tokenAcl;

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, true);

    assert.deepStrictEqual(results.paths['/*/rtc/**'], {
      methods: 'ANY',
      methodsStatus: status.OK,
      filtersStatus: status.OK,
      state: status.OK,
    });

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'PUT, DELETE',
      methodsStatus: status.OK,
      filtersStatus: status.OK,
      state: status.OK,
    });
    assert.deepStrictEqual(dumpAclDiff(results), [
      '✅ [ANY]          /*/rtc/**',
      '✅ [PUT, DELETE]  /messages/*',
    ].join('\n'));
  });

  test('Will pass when path in token but not acl', () => {
    const tokenAcl = {
      'paths': {
        '/*/rtc/**': {},

        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/*/rtc/**': {},
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, true);

    assert.deepStrictEqual(results.paths['/*/rtc/**'], {
      methods: 'ANY',
      methodsStatus: status.OK,
      filtersStatus: status.OK,
      state: status.OK,
    });

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'ANY',
      methodsStatus: status.OK,
      filtersStatus: status.OK,
      state: status.PRESENT,
    });

    assert.deepStrictEqual(dumpAclDiff(results), [
      '✅ [ANY]  /*/rtc/**',
      'ℹ️ [ANY]  /messages/* (present in token)',
    ].join('\n'));
  });

  test('Will pass when filters in the flag but not the token', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, true);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'ANY',
      methodsStatus: status.OK,
      filtersStatus: status.MISSING,
      state: status.PASS,
    });

    assert.deepStrictEqual(dumpAclDiff(results), ['ℹ️ [ANY]  /messages/* (No filter is specified in the token)'].join('\n'));
  });

  test('Will fail when methods in token but not flag', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {},
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'ANY',
      methodsStatus: status.PRESENT,
      filtersStatus: status.OK,
      state: status.INVALID,
    });

    assert.deepStrictEqual(dumpAclDiff(results), ['❌ [ANY]  /messages/* (methods present in token)'].join('\n'));
  });

  test('Will fail when methods in flag but not token', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'PUT, DELETE',
      methodsStatus: status.MISSING,
      filtersStatus: status.OK,
      state: status.INVALID,
    });

    assert.deepStrictEqual(dumpAclDiff(results), ['❌ [PUT, DELETE]  /messages/* (methods missing in token)'].join('\n'));
  });

  test('Will fail when methods are mismatched', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['GET', 'DELETE'],
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'GET, DELETE',
      methodsStatus: status.MISMATCH,
      filtersStatus: status.OK,
      state: status.INVALID,
    });

    assert.deepStrictEqual(dumpAclDiff(results), ['❌ [GET, DELETE]  /messages/* (methods mismatch)'].join('\n'));
  });

  test('Will fail when filters in token but not flag', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {},
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'ANY',
      methodsStatus: status.OK,
      filtersStatus: status.PRESENT,
      state: status.INVALID,
    });

    assert.deepStrictEqual(dumpAclDiff(results), ['❌ [ANY]  /messages/* (filters present in token)'].join('\n'));
  });

  test('Will fail when filters are mismatched', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'filters': {
            'to': '447977271009',
            'fizz': 'buzz',
          },
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'ANY',
      methodsStatus: status.OK,
      filtersStatus: status.MISMATCH,
      state: status.INVALID,
    });

    assert.deepStrictEqual(dumpAclDiff(results), ['❌ [ANY]  /messages/* (filters mismatch)'].join('\n'));
  });

  test('Will fail when both filters and methods are mismatched', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
          'filters': {
            'to': '447977271009',
            'fizz': 'buzz',
          },
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['GET', 'DELETE'],
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'GET, DELETE',
      methodsStatus: status.MISMATCH,
      filtersStatus: status.MISMATCH,
      state: status.INVALID,
    });

    assert.deepStrictEqual(
      dumpAclDiff(results),
      ['❌ [GET, DELETE]  /messages/* (methods mismatch & filters mismatch)'].join('\n'),
    );
  });

  test('Will fail when filters are missing and methods are mismatched', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['GET', 'DELETE'],
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'GET, DELETE',
      methodsStatus: status.MISMATCH,
      filtersStatus: status.MISSING,
      state: status.INVALID,
    });

    assert.deepStrictEqual(
      dumpAclDiff(results),
      ['❌ [GET, DELETE]  /messages/* (methods mismatch & No filter is specified in the token)'].join('\n'),
    );
  });

  test('Will fail when filters are present and methods are mismatched', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['PUT', 'DELETE'],
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['GET', 'DELETE'],
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'GET, DELETE',
      methodsStatus: status.MISMATCH,
      filtersStatus: status.PRESENT,
      state: status.INVALID,
    });

    assert.deepStrictEqual(
      dumpAclDiff(results),
      // Done mention filters present since that did not cause the failure
      ['❌ [GET, DELETE]  /messages/* (methods mismatch)'].join('\n'),
    );
  });

  test('Will fail when filters are present and methods are missing', () => {
    const tokenAcl = {
      'paths': {
        '/messages/*': {
          'filters': {
            'to': '447977271009',
          },
        },
      },
    };

    const flagAcl = {
      'paths': {
        '/messages/*': {
          'methods': ['GET', 'DELETE'],
        },
      },
    };

    const results = aclDiff(tokenAcl, flagAcl);
    assert.strictEqual(results.ok, false);

    assert.deepStrictEqual(results.paths['/messages/*'], {
      methods: 'GET, DELETE',
      methodsStatus: status.MISSING,
      filtersStatus: status.PRESENT,
      state: status.INVALID,
    });

    assert.deepStrictEqual(
      dumpAclDiff(results),
      ['❌ [GET, DELETE]  /messages/* (methods missing in token)'].join('\n'),
    );
  });
});
