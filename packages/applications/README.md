@vonage/cli-plugin-applications
=======================

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@vonage/cli-plugin-applications.svg)](https://npmjs.org/applications/@vonage/cli-plugin-applications)
[![Downloads/week](https://img.shields.io/npm/dw/@vonage/cli-plugin-applications.svg)](https://npmjs.org/applications/@vonage/cli-plugin-applications)
[![License](https://img.shields.io/npm/l/@vonage/cli-plugin-applications.svg)](https://github.com/Vonage/vonage-cli/blob/master/applicationss/applications/applications.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage
<!-- usage -->
```sh-session
$ npm install -g @vonage/cli-plugin-applications
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@vonage/cli-plugin-applications/1.0.0-beta.0 linux-x64 node-v12.18.2
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example app`](#oclif-example-app)
* [`oclif-example app:create [NAME]`](#oclif-example-appcreate-name)
* [`oclif-example app:delete [APPID]`](#oclif-example-appdelete-appid)
* [`oclif-example app:link [APPID]`](#oclif-example-applink-appid)
* [`oclif-example app:show [APPID]`](#oclif-example-appshow-appid)
* [`oclif-example app:unlink`](#oclif-example-appunlink)
* [`oclif-example app:update [APPID]`](#oclif-example-appupdate-appid)

## `oclif-example app`

manage your Vonage applications

```
USAGE
  $ oclif-example app

OPTIONS
  -h, --help              show CLI help
  --filter=filter         filter property by partial string matching, ex: name=foo
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLES
  vonage app
  vonage app --output=json
```

_See code: [dist/commands/app/index.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.0/dist/commands/app/index.js)_

## `oclif-example app:create [NAME]`

create a new Vonage application

```
USAGE
  $ oclif-example app:create [NAME]

OPTIONS
  -h, --help                                   show CLI help
  --messages_inbound_url=messages_inbound_url  Messages Inbound Webhook URL Address
  --messages_status_url=messages_status_url    Messages Status Webhook URL Address
  --rtc_event_http=GET|POST                    RTC Event Webhook HTTP Method
  --rtc_event_url=rtc_event_url                RTC Event Webhook URL Address
  --vbc                                        VBC Capabilities Enabled
  --voice_answer_http=GET|POST                 Voice Answer Webhook HTTP Method
  --voice_answer_url=voice_answer_url          Voice Answer Webhook URL Address
  --voice_event_http=GET|POST                  Voice Event Webhook HTTP Method
  --voice_event_url=voice_event_url            Voice Event Webhook URL Address

EXAMPLES
  vonage app:create
  vonage app:create APP_NAME --voice_answer_url=https://www.sample.com
```

_See code: [dist/commands/app/create.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.0/dist/commands/app/create.js)_

## `oclif-example app:delete [APPID]`

delete a Vonage application

```
USAGE
  $ oclif-example app:delete [APPID]

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  vonage app:delete 00000000-0000-0000-0000-000000000000
  vonage app:delete
```

_See code: [dist/commands/app/delete.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.0/dist/commands/app/delete.js)_

## `oclif-example app:link [APPID]`

link numbers to Vonage application

```
USAGE
  $ oclif-example app:link [APPID]

OPTIONS
  -h, --help       show CLI help
  --number=number  Owned number to be assigned
```

_See code: [dist/commands/app/link.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.0/dist/commands/app/link.js)_

## `oclif-example app:show [APPID]`

show Vonage application details

```
USAGE
  $ oclif-example app:show [APPID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/app/show.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.0/dist/commands/app/show.js)_

## `oclif-example app:unlink`

unlink numbers from Vonage application

```
USAGE
  $ oclif-example app:unlink

OPTIONS
  -h, --help       show CLI help
  --number=number  Owned number to be unassigned
```

_See code: [dist/commands/app/unlink.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.0/dist/commands/app/unlink.js)_

## `oclif-example app:update [APPID]`

update a Vonage application

```
USAGE
  $ oclif-example app:update [APPID]

OPTIONS
  -h, --help                                   show CLI help
  --messages_inbound_url=messages_inbound_url  Messages Inbound Webhook URL Address
  --messages_status_url=messages_status_url    Messages Status Webhook URL Address
  --name=name                                  Name of Vonage Application
  --rtc_event_http=GET|POST                    RTC Event Webhook HTTP Method
  --rtc_event_url=rtc_event_url                RTC Event Webhook URL Address
  --vbc                                        VBC Capabilities Enabled
  --voice_answer_http=GET|POST                 Voice Answer Webhook HTTP Method
  --voice_answer_url=voice_answer_url          Voice Answer Webhook URL Address
  --voice_event_http=GET|POST                  Voice Event Webhook HTTP Method
  --voice_event_url=voice_event_url            Voice Event Webhook URL Address

EXAMPLES
  vonage app:update
  vonage app:update APP_ID --voice_answer_url="https://www.example.com/answer
```

_See code: [dist/commands/app/update.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.0/dist/commands/app/update.js)_
<!-- commandsstop -->
