# kja-cli-plugin-numbers

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/kja-cli-plugin-numbers.svg)](https://npmjs.org/package/kja-cli-plugin-numbers)
[![Downloads/week](https://img.shields.io/npm/dw/kja-cli-plugin-numbers.svg)](https://npmjs.org/package/kja-cli-plugin-numbers)
[![License](https://img.shields.io/npm/l/kja-cli-plugin-numbers.svg)](https://github.com/Vonage/cli-plugin-numbers/blob/master/package.json)

<!-- toc -->
* [kja-cli-plugin-numbers](#kja-cli-plugin-numbers)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g kja-cli-plugin-numbers
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
kja-cli-plugin-numbers/1.0.0-alpha.20 linux-x64 node-v12.18.2
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

## `oclif-example number:buy [NUMBER] [COUNTRYCODE]`

manage Vonage numbers

```
USAGE
  $ oclif-example number:buy [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

## `oclif-example number:cancel [NUMBER] [COUNTRYCODE]`

manage Vonage numbers

```
USAGE
  $ oclif-example number:cancel [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

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
<!-- commandsstop -->
