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
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@vonage/cli-plugin-sms/1.1.1 linux-x64 node-v16.14.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`oclif-example sms --to=15551234567 --from=15551234567 --message='Hello there!'`](#oclif-example-sms---to15551234567---from15551234567---messagehello-there)

## `oclif-example sms --to=15551234567 --from=15551234567 --message='Hello there!'`

Send a simple SMS.

```
USAGE
  $ oclif-example sms --to=15551234567 --from=15551234567 --message='Hello there!'

OPTIONS
  -h, --help         show CLI help
  --from=from        (required)
  --message=message  [default: Hello from the Vonage CLI!]
  --to=to            (required)

EXAMPLE
  vonage sms --to=15551234567 --from=15551234567 --message='Hello there!'
```

_See code: [dist/commands/sms/index.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.1/dist/commands/sms/index.ts)_
<!-- commandsstop -->
