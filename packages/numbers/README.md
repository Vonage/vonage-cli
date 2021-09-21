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
@vonage/cli-plugin-numbers/1.0.0 linux-x64 node-v12.18.2
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example numbers`](#oclif-example-numbers)
* [`oclif-example numbers:buy [NUMBER] [COUNTRYCODE]`](#oclif-example-numbersbuy-number-countrycode)
* [`oclif-example numbers:cancel [NUMBER] [COUNTRYCODE]`](#oclif-example-numberscancel-number-countrycode)
* [`oclif-example numbers:search [COUNTRYCODE]`](#oclif-example-numberssearch-countrycode)

## `oclif-example numbers`

manage your Vonage numbers

```
USAGE
  $ oclif-example numbers

OPTIONS
  -h, --help              show CLI help
  -x, --extended          show extra columns
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLE
  vonage number
```

_See code: [dist/commands/numbers/index.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0/dist/commands/numbers/index.js)_

## `oclif-example numbers:buy [NUMBER] [COUNTRYCODE]`

buy a Vonage number

```
USAGE
  $ oclif-example numbers:buy [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/numbers/buy.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0/dist/commands/numbers/buy.js)_

## `oclif-example numbers:cancel [NUMBER] [COUNTRYCODE]`

cancel a Vonage number

```
USAGE
  $ oclif-example numbers:cancel [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/numbers/cancel.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0/dist/commands/numbers/cancel.js)_

## `oclif-example numbers:search [COUNTRYCODE]`

search for available Vonage numbers

```
USAGE
  $ oclif-example numbers:search [COUNTRYCODE]

OPTIONS
  -h, --help                                     show CLI help
  --contains=contains
  --endsWith=endsWith
  --features=features
  --startsWith=startsWith                        Search for numbers that start with certain numbers.
  --type=landline|mobile-lvn|landline-toll-free  Filter by type of number, such as mobile or landline

EXAMPLES
  vonage numbers:search US
  vonage numbers:search US --startsWith=1555
  vonage numbers:search US --features=VOICE,SMS --endsWith=1234
```

_See code: [dist/commands/numbers/search.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0/dist/commands/numbers/search.js)_
<!-- commandsstop -->
