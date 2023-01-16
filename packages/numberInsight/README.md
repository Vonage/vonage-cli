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
$ npm install -g @vonage/cli-plugin-numberinsight
$ @vonage/cli-plugin-numberinsight COMMAND
running command...
$ @vonage/cli-plugin-numberinsight (--version)
@vonage/cli-plugin-numberinsight/1.2.3 darwin-arm64 node-v16.18.1
$ @vonage/cli-plugin-numberinsight --help [COMMAND]
USAGE
  $ @vonage/cli-plugin-numberinsight COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`@vonage/cli-plugin-numberinsight numberinsight NUMBER`](#vonagecli-plugin-numberinsight-numberinsight-number)

## `@vonage/cli-plugin-numberinsight numberinsight NUMBER`

get details about a phone number

```
USAGE
  $ @vonage/cli-plugin-numberinsight numberinsight [NUMBER] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>] [--level basic|standard|advanced] [-y]

FLAGS
  -y, --confirm
  --level=<option>  [default: basic]
                    <options: basic|standard|advanced>

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  get details about a phone number

EXAMPLES
  vonage numberinsight 15555555555

  vonage numberinsight 15555555555 --level=advanced
```

_See code: [dist/commands/numberinsight/index.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3/dist/commands/numberinsight/index.js)_
<!-- commandsstop -->
