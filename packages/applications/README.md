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
@vonage/cli-plugin-applications/1.1.2 linux-x64 node-v16.14.0
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`oclif-example apps`](#oclif-example-apps)
* [`oclif-example apps:create [NAME]`](#oclif-example-appscreate-name)
* [`oclif-example apps:delete [APPID]`](#oclif-example-appsdelete-appid)
* [`oclif-example apps:link [APPID] --number=[NUMBER]`](#oclif-example-appslink-appid---numbernumber)
* [`oclif-example apps:show [APPID]`](#oclif-example-appsshow-appid)
* [`oclif-example apps:unlink`](#oclif-example-appsunlink)
* [`oclif-example apps:update [APPID]`](#oclif-example-appsupdate-appid)

## `oclif-example apps`

manage your Vonage applications

```
USAGE
  $ oclif-example apps

OPTIONS
  -h, --help              show CLI help
  --filter=filter         filter property by partial string matching, ex: name=foo
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLES
  vonage apps
  vonage apps --output=json
```

_See code: [dist/commands/apps/index.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/apps/index.ts)_

## `oclif-example apps:create [NAME]`

create a new Vonage application

```
USAGE
  $ oclif-example apps:create [NAME]

OPTIONS
  -h, --help                                   show CLI help

  --improve_ai                                 Allow use of data for AI training? Read data collection disclosure -
                                               https://help.nexmo.com/hc/en-us/articles/4401914566036

  --messages_inbound_http=GET|POST             Messages Inbound Webhook HTTP Method

  --messages_inbound_url=messages_inbound_url  Messages Inbound Webhook URL Address

  --messages_status_http=GET|POST              Messages Status Webhook HTTP Method

  --messages_status_url=messages_status_url    Messages Status Webhook URL Address

  --rtc_event_http=GET|POST                    RTC Event Webhook HTTP Method

  --rtc_event_url=rtc_event_url                RTC Event Webhook URL Address

  --vbc                                        VBC Capabilities Enabled

  --voice_answer_http=GET|POST                 Voice Answer Webhook HTTP Method

  --voice_answer_url=voice_answer_url          Voice Answer Webhook URL Address

  --voice_event_http=GET|POST                  Voice Event Webhook HTTP Method

  --voice_event_url=voice_event_url            Voice Event Webhook URL Address

EXAMPLES
  vonage apps:create
  vonage apps:create APP_NAME --voice_answer_url=https://www.sample.com --voice_event_url=https://www.sample.com
```

_See code: [dist/commands/apps/create.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/apps/create.ts)_

## `oclif-example apps:delete [APPID]`

delete a Vonage application

```
USAGE
  $ oclif-example apps:delete [APPID]

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  vonage apps:delete 00000000-0000-0000-0000-000000000000
  vonage apps:delete
```

_See code: [dist/commands/apps/delete.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/apps/delete.ts)_

## `oclif-example apps:link [APPID] --number=[NUMBER]`

link numbers to Vonage application

```
USAGE
  $ oclif-example apps:link [APPID] --number=[NUMBER]

OPTIONS
  -h, --help       show CLI help
  --number=number  (required) Owned number to be assigned
```

_See code: [dist/commands/apps/link.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/apps/link.ts)_

## `oclif-example apps:show [APPID]`

show Vonage application details

```
USAGE
  $ oclif-example apps:show [APPID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/show.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/apps/show.ts)_

## `oclif-example apps:unlink`

unlink numbers from Vonage application

```
USAGE
  $ oclif-example apps:unlink

OPTIONS
  -h, --help       show CLI help
  --number=number  Owned number to be unassigned
```

_See code: [dist/commands/apps/unlink.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/apps/unlink.ts)_

## `oclif-example apps:update [APPID]`

update a Vonage application

```
USAGE
  $ oclif-example apps:update [APPID]

OPTIONS
  -h, --help                                   show CLI help
  --messages_inbound_http=GET|POST             Messages Inbound Webhook HTTP Method
  --messages_inbound_url=messages_inbound_url  Messages Inbound Webhook URL Address
  --messages_status_http=GET|POST              Messages Status Webhook HTTP Method
  --messages_status_url=messages_status_url    Messages Status Webhook URL Address
  --rtc_event_http=GET|POST                    RTC Event Webhook HTTP Method
  --rtc_event_url=rtc_event_url                RTC Event Webhook URL Address
  --vbc                                        VBC Capabilities Enabled
  --voice_answer_http=GET|POST                 Voice Answer Webhook HTTP Method
  --voice_answer_url=voice_answer_url          Voice Answer Webhook URL Address
  --voice_event_http=GET|POST                  Voice Event Webhook HTTP Method
  --voice_event_url=voice_event_url            Voice Event Webhook URL Address

EXAMPLES
  vonage apps:update
  vonage apps:update APP_ID --voice_answer_url="https://www.example.com/answer
```

_See code: [dist/commands/apps/update.ts](https://github.com/Vonage/vonage-cli/blob/v1.1.2/dist/commands/apps/update.ts)_
<!-- commandsstop -->
