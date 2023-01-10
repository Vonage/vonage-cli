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
$ @vonage/cli-plugin-applications COMMAND
running command...
$ @vonage/cli-plugin-applications (--version)
@vonage/cli-plugin-applications/1.2.3-alpha.0 darwin-arm64 node-v16.18.1
$ @vonage/cli-plugin-applications --help [COMMAND]
USAGE
  $ @vonage/cli-plugin-applications COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`@vonage/cli-plugin-applications apps`](#vonagecli-plugin-applications-apps)
* [`@vonage/cli-plugin-applications apps:create [NAME]`](#vonagecli-plugin-applications-appscreate-name)
* [`@vonage/cli-plugin-applications apps:delete [APPID]`](#vonagecli-plugin-applications-appsdelete-appid)
* [`@vonage/cli-plugin-applications apps:link [APPID] --number=[NUMBER]`](#vonagecli-plugin-applications-appslink-appid---numbernumber)
* [`@vonage/cli-plugin-applications apps:show [APPID]`](#vonagecli-plugin-applications-appsshow-appid)
* [`@vonage/cli-plugin-applications apps:unlink`](#vonagecli-plugin-applications-appsunlink)
* [`@vonage/cli-plugin-applications apps:update [APPID]`](#vonagecli-plugin-applications-appsupdate-appid)

## `@vonage/cli-plugin-applications apps`

manage your Vonage applications

```
USAGE
  $ @vonage/cli-plugin-applications apps [--apiKey <value> --apiSecret <value>] [--appId <value> --keyFile
    <value>] [--sort <value>] [--filter <value>] [--output csv|json|yaml |  | ]

FLAGS
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  manage your Vonage applications

EXAMPLES
  vonage apps

  vonage apps --output=json
```

_See code: [dist/commands/apps/index.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3-alpha.0/dist/commands/apps/index.js)_

## `@vonage/cli-plugin-applications apps:create [NAME]`

create a new Vonage application

```
USAGE
  $ @vonage/cli-plugin-applications apps:create [NAME] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>] [--voice_answer_http GET|POST [--voice_answer_url <value> --voice_event_url <value>]]
    [--voice_event_http GET|POST ] [--messages_inbound_http GET|POST --messages_inbound_url <value>]
    [--messages_status_http GET|POST --messages_status_url <value>] [--rtc_event_http GET|POST --rtc_event_url <value>]
    [--vbc] [--improve_ai]

FLAGS
  --improve_ai                      Allow use of data for AI training? Read data collection disclosure -
                                    https://help.nexmo.com/hc/en-us/articles/4401914566036
  --messages_inbound_http=<option>  Messages Inbound Webhook HTTP Method
                                    <options: GET|POST>
  --messages_inbound_url=<value>    Messages Inbound Webhook URL Address
  --messages_status_http=<option>   Messages Status Webhook HTTP Method
                                    <options: GET|POST>
  --messages_status_url=<value>     Messages Status Webhook URL Address
  --rtc_event_http=<option>         RTC Event Webhook HTTP Method
                                    <options: GET|POST>
  --rtc_event_url=<value>           RTC Event Webhook URL Address
  --vbc                             VBC Capabilities Enabled
  --voice_answer_http=<option>      Voice Answer Webhook HTTP Method
                                    <options: GET|POST>
  --voice_answer_url=<value>        Voice Answer Webhook URL Address
  --voice_event_http=<option>       Voice Event Webhook HTTP Method
                                    <options: GET|POST>
  --voice_event_url=<value>         Voice Event Webhook URL Address

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  create a new Vonage application

EXAMPLES
  vonage apps:create

  vonage apps:create APP_NAME --voice_answer_url=https://www.sample.com --voice_event_url=https://www.sample.com
```

_See code: [dist/commands/apps/create.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3-alpha.0/dist/commands/apps/create.js)_

## `@vonage/cli-plugin-applications apps:delete [APPID]`

delete a Vonage application

```
USAGE
  $ @vonage/cli-plugin-applications apps:delete [APPID] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  delete a Vonage application

EXAMPLES
  vonage apps:delete 00000000-0000-0000-0000-000000000000

  vonage apps:delete
```

_See code: [dist/commands/apps/delete.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3-alpha.0/dist/commands/apps/delete.js)_

## `@vonage/cli-plugin-applications apps:link [APPID] --number=[NUMBER]`

link numbers to Vonage application

```
USAGE
  $ @vonage/cli-plugin-applications apps:link [APPID] --number=[NUMBER]

FLAGS
  --number=<value>  (required) Owned number to be assigned

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  link numbers to Vonage application
```

_See code: [dist/commands/apps/link.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3-alpha.0/dist/commands/apps/link.js)_

## `@vonage/cli-plugin-applications apps:show [APPID]`

show Vonage application details

```
USAGE
  $ @vonage/cli-plugin-applications apps:show [APPID] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  show Vonage application details
```

_See code: [dist/commands/apps/show.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3-alpha.0/dist/commands/apps/show.js)_

## `@vonage/cli-plugin-applications apps:unlink`

unlink numbers from Vonage application

```
USAGE
  $ @vonage/cli-plugin-applications apps:unlink [--apiKey <value> --apiSecret <value>] [--appId <value> --keyFile
    <value>] [--number <value>]

FLAGS
  --number=<value>  Owned number to be unassigned

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  unlink numbers from Vonage application
```

_See code: [dist/commands/apps/unlink.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3-alpha.0/dist/commands/apps/unlink.js)_

## `@vonage/cli-plugin-applications apps:update [APPID]`

update a Vonage application

```
USAGE
  $ @vonage/cli-plugin-applications apps:update [APPID] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>] [--voice_answer_url <value>] [--voice_answer_http GET|POST] [--voice_event_url <value>]
    [--voice_event_http GET|POST] [--messages_inbound_url <value>] [--messages_inbound_http GET|POST]
    [--messages_status_url <value>] [--messages_status_http GET|POST] [--rtc_event_url <value>] [--rtc_event_http
    GET|POST] [--vbc]

FLAGS
  --messages_inbound_http=<option>  Messages Inbound Webhook HTTP Method
                                    <options: GET|POST>
  --messages_inbound_url=<value>    Messages Inbound Webhook URL Address
  --messages_status_http=<option>   Messages Status Webhook HTTP Method
                                    <options: GET|POST>
  --messages_status_url=<value>     Messages Status Webhook URL Address
  --rtc_event_http=<option>         RTC Event Webhook HTTP Method
                                    <options: GET|POST>
  --rtc_event_url=<value>           RTC Event Webhook URL Address
  --vbc                             VBC Capabilities Enabled
  --voice_answer_http=<option>      Voice Answer Webhook HTTP Method
                                    <options: GET|POST>
  --voice_answer_url=<value>        Voice Answer Webhook URL Address
  --voice_event_http=<option>       Voice Event Webhook HTTP Method
                                    <options: GET|POST>
  --voice_event_url=<value>         Voice Event Webhook URL Address

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  update a Vonage application

EXAMPLES
  vonage apps:update

  vonage apps:update APP_ID --voice_answer_url="https://www.example.com/answer
```

_See code: [dist/commands/apps/update.js](https://github.com/Vonage/vonage-cli/blob/v1.2.3-alpha.0/dist/commands/apps/update.js)_
<!-- commandsstop -->
