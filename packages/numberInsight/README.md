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
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@vonage/cli-plugin-numberinsight/1.1.3 linux-x64 node-v14.2.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example numberinsight NUMBER`](#oclif-example-numberinsight-number)

## `oclif-example numberinsight NUMBER`

get details about a phone number

```
USAGE
  $ oclif-example numberinsight NUMBER

OPTIONS
  -h, --help                       show CLI help
  -y, --confirm
  --level=basic|standard|advanced  [default: basic]

EXAMPLES
  vonage numberinsight 15555555555
  vonage numberinsight 15555555555 --level=advanced
```

_See code: [dist/commands/numberinsight/index.js](https://github.com/Vonage/vonage-cli/blob/v1.1.3/dist/commands/numberinsight/index.js)_
<!-- commandsstop -->
