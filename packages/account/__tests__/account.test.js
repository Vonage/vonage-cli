'use strict';

const account = require('..');
const assert = require('assert').strict;

assert.strictEqual(account(), 'Hello from account');
console.info("account tests passed");
