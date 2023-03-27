'use strict';

const jwt = require('..');
const assert = require('assert').strict;

assert.strictEqual(jwt(), 'Hello from jwt');
console.info("jwt tests passed");
