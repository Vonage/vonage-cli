#!/usr/bin/env node
const { hideBin } = require('yargs/helpers');
require('yargs/yargs')(hideBin(process.argv))
.commandDir('../src/commands')
.demandCommand()
.help()
   .parse(); 


