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
@vonage/cli-plugin-numbers/1.1.2 linux-x64 node-v16.14.0
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
* [`oclif-example numbers:update NUMBER COUNTRYCODE --url=https://www.example.com`](#oclif-example-numbersupdate-number-countrycode---urlhttpswwwexamplecom)

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

_See code: [dist/commands/numbers/index.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/numbers/index.ts)_

## `oclif-example numbers:buy [NUMBER] [COUNTRYCODE]`

buy a Vonage number

```
USAGE
  $ oclif-example numbers:buy [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/numbers/buy.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/numbers/buy.ts)_

## `oclif-example numbers:cancel [NUMBER] [COUNTRYCODE]`

cancel a Vonage number

```
USAGE
  $ oclif-example numbers:cancel [NUMBER] [COUNTRYCODE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/numbers/cancel.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/numbers/cancel.ts)_

## `oclif-example numbers:search [COUNTRYCODE]`

search for available Vonage numbers

```
USAGE
  $ oclif-example numbers:search [COUNTRYCODE]

OPTIONS
  -h, --help                                                          show CLI help
  --contains=contains                                                 Filter from anywhere in the phone number.
  --endsWith=endsWith                                                 Filter from the end of the phone number.

  --features=SMS|VOICE|SMS,VOICE|MMS|SMS,MMS|VOICE,MMS|SMS,MMS,VOICE  Available features are SMS, VOICE and MMS. To look
                                                                      for numbers that support multiple features, use a
                                                                      comma-separated value: SMS,MMS,VOICE.

  --startsWith=startsWith                                             Filter from the start of the phone number.

  --type=landline|mobile-lvn|landline-toll-free                       Filter by type of number, such as mobile or
                                                                      landline

EXAMPLES
  vonage numbers:search US
  vonage numbers:search US --startsWith=1555
  vonage numbers:search US --features=VOICE,SMS --endsWith=1234
```

_See code: [dist/commands/numbers/search.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/numbers/search.ts)_

## `oclif-example numbers:update NUMBER COUNTRYCODE --url=https://www.example.com`

update a Vonage Number

```
USAGE
  $ oclif-example numbers:update NUMBER COUNTRYCODE --url=https://www.example.com

OPTIONS
  -h, --help  show CLI help
  --url=url   url for mobile inbound webhook
```

_See code: [dist/commands/numbers/update.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/numbers/update.ts)_
<!-- commandsstop -->
