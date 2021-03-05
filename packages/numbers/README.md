@vonage/cli-plugin-numbers
==========================



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@vonage/cli-plugin-numbers.svg)](https://npmjs.org/package/@vonage/cli-plugin-numbers)
[![Downloads/week](https://img.shields.io/npm/dw/@vonage/cli-plugin-numbers.svg)](https://npmjs.org/package/@vonage/cli-plugin-numbers)
[![License](https://img.shields.io/npm/l/@vonage/cli-plugin-numbers.svg)](https://github.com/Vonage/cli-plugin-numbers/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @vonage/cli-plugin-numbers
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@vonage/cli-plugin-numbers/1.0.0-alpha.11 linux-x64 node-v12.18.2
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example number`](#oclif-example-number)
* [`oclif-example number:buy [NUMBER] [COUNTRYCODE]`](#oclif-example-numberbuy-number-countrycode)
* [`oclif-example number:cancel [NUMBER] [COUNTRYCODE]`](#oclif-example-numbercancel-number-countrycode)
* [`oclif-example number:search [COUNTRYCODE]`](#oclif-example-numbersearch-countrycode)

## `oclif-example number`

manage Vonage numbers

```
USAGE
  $ oclif-example number

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ vonage number
  list all numbers
```

_See code: [dist/commands/number/index.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-alpha.11/dist/commands/number/index.js)_

## `oclif-example number:buy [NUMBER] [COUNTRYCODE]`

manage Vonage numbers

```
USAGE
  $ oclif-example number:buy [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/number/buy.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-alpha.11/dist/commands/number/buy.js)_

## `oclif-example number:cancel [NUMBER] [COUNTRYCODE]`

manage Vonage numbers

```
USAGE
  $ oclif-example number:cancel [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/number/cancel.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-alpha.11/dist/commands/number/cancel.js)_

## `oclif-example number:search [COUNTRYCODE]`

manage Vonage numbers

```
USAGE
  $ oclif-example number:search [COUNTRYCODE]

OPTIONS
  -h, --help                                     show CLI help
  --contains=contains
  --endsWith=endsWith
  --features=features
  --startsWith=startsWith
  --type=landline|mobile-lvn|landline-toll-free
```

_See code: [dist/commands/number/search.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-alpha.11/dist/commands/number/search.js)_
<!-- commandsstop -->
