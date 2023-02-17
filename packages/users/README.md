# @vonage/cli-plugin-conversations

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@vonage/cli-plugin-conversations.svg)](https://npmjs.org/conversations/@vonage/cli-plugin-conversations)
[![Downloads/week](https://img.shields.io/npm/dw/@vonage/cli-plugin-conversations.svg)](https://npmjs.org/conversations/@vonage/cli-plugin-conversations)
[![License](https://img.shields.io/npm/l/@vonage/cli-plugin-conversations.svg)](https://github.com/Vonage/vonage-cli/blob/master/conversationss/conversations/conversations.json)

<!-- toc -->
* [@vonage/cli-plugin-conversations](#vonagecli-plugin-conversations)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @vonage/cli-plugin-users
$ @vonage/cli-plugin-users COMMAND
running command...
$ @vonage/cli-plugin-users (--version)
@vonage/cli-plugin-users/1.2.4 darwin-arm64 node-v16.18.1
$ @vonage/cli-plugin-users --help [COMMAND]
USAGE
  $ @vonage/cli-plugin-users COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`@vonage/cli-plugin-users apps:users`](#vonagecli-plugin-users-appsusers)
* [`@vonage/cli-plugin-users apps:users:create [NAME]`](#vonagecli-plugin-users-appsuserscreate-name)
* [`@vonage/cli-plugin-users apps:users:delete [USERID]`](#vonagecli-plugin-users-appsusersdelete-userid)
* [`@vonage/cli-plugin-users apps:users:show [USERID]`](#vonagecli-plugin-users-appsusersshow-userid)
* [`@vonage/cli-plugin-users apps:users:update [USERID]`](#vonagecli-plugin-users-appsusersupdate-userid)

## `@vonage/cli-plugin-users apps:users`

```
USAGE
  $ @vonage/cli-plugin-users apps:users [--apiKey <value> --apiSecret <value>] [--appId <value> --keyFile
    <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>
```

_See code: [dist/commands/apps/users/index.js](https://github.com/Vonage/vonage-cli/blob/v1.2.4/dist/commands/apps/users/index.js)_

## `@vonage/cli-plugin-users apps:users:create [NAME]`

```
USAGE
  $ @vonage/cli-plugin-users apps:users:create [NAME] [--apiKey <value> --apiSecret <value>] [--appId <value> --keyFile
    <value>] [--display_name <value>] [--image_url <value>]

FLAGS
  --display_name=<value>
  --image_url=<value>

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>
```

_See code: [dist/commands/apps/users/create.js](https://github.com/Vonage/vonage-cli/blob/v1.2.4/dist/commands/apps/users/create.js)_

## `@vonage/cli-plugin-users apps:users:delete [USERID]`

```
USAGE
  $ @vonage/cli-plugin-users apps:users:delete [USERID] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>
```

_See code: [dist/commands/apps/users/delete.js](https://github.com/Vonage/vonage-cli/blob/v1.2.4/dist/commands/apps/users/delete.js)_

## `@vonage/cli-plugin-users apps:users:show [USERID]`

```
USAGE
  $ @vonage/cli-plugin-users apps:users:show [USERID] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>
```

_See code: [dist/commands/apps/users/show.js](https://github.com/Vonage/vonage-cli/blob/v1.2.4/dist/commands/apps/users/show.js)_

## `@vonage/cli-plugin-users apps:users:update [USERID]`

```
USAGE
  $ @vonage/cli-plugin-users apps:users:update [USERID] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>] [--name <value>] [--display_name <value>] [--image_url <value>]

FLAGS
  --display_name=<value>
  --image_url=<value>
  --name=<value>

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>
```

_See code: [dist/commands/apps/users/update.js](https://github.com/Vonage/vonage-cli/blob/v1.2.4/dist/commands/apps/users/update.js)_
<!-- commandsstop -->
