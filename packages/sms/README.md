# @vonage/cli-plugin-sms

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@vonage/cli-plugin-sms.svg)](https://npmjs.org/package/@vonage/cli-plugin-numbers)
[![Downloads/week](https://img.shields.io/npm/dw/@vonage/cli-plugin-sms.svg)](https://npmjs.org/package/@vonage/cli-plugin-numbers)
[![License](https://img.shields.io/npm/l/@vonage/cli-plugin-sms.svg)](https://github.com/Vonage/cli-plugin-numbers/blob/master/package.json)

<!-- toc -->
* [@vonage/cli-plugin-sms](#vonagecli-plugin-sms)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @vonage/cli-plugin-sms
$ @vonage/cli-plugin-sms COMMAND
running command...
$ @vonage/cli-plugin-sms (--version)
@vonage/cli-plugin-sms/1.2.2 darwin-arm64 node-v16.18.1
$ @vonage/cli-plugin-sms --help [COMMAND]
USAGE
  $ @vonage/cli-plugin-sms COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`@vonage/cli-plugin-sms sms --to=15551234567 --from=15551234567 --message='Hello there!'`](#vonagecli-plugin-sms-sms---to15551234567---from15551234567---messagehello-there)

## `@vonage/cli-plugin-sms sms --to=15551234567 --from=15551234567 --message='Hello there!'`

Send a simple SMS.

```
USAGE
  $ @vonage/cli-plugin-sms sms --to=15551234567 --from=15551234567 --message='Hello there!'

FLAGS
  --from=<value>     (required)
  --message=<value>  [default: Hello from the Vonage CLI!]
  --to=<value>       (required)

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Send a simple SMS.

EXAMPLES
  vonage sms --to=15551234567 --from=15551234567 --message='Hello there!'
```

_See code: [dist/commands/sms/index.js](https://github.com/Vonage/vonage-cli/blob/v1.2.2/dist/commands/sms/index.js)_
<!-- commandsstop -->
