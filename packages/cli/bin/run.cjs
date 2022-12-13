#!/usr/bin/env -S NODE_NO_WARNINGS=1 node 

const oclif = require('@oclif/core')

oclif.run().then(require('@oclif/core/flush')).catch(require('@oclif/core/handle'))
