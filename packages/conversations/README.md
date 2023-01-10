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
$ npm install -g @vonage/cli-plugin-conversations
$ @vonage/cli-plugin-conversations COMMAND
running command...
$ @vonage/cli-plugin-conversations (--version)
@vonage/cli-plugin-conversations/1.0.2-alpha.0 darwin-arm64 node-v16.18.1
$ @vonage/cli-plugin-conversations --help [COMMAND]
USAGE
  $ @vonage/cli-plugin-conversations COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`@vonage/cli-plugin-conversations apps:conversations`](#vonagecli-plugin-conversations-appsconversations)
* [`@vonage/cli-plugin-conversations apps:conversations:create [NAME]`](#vonagecli-plugin-conversations-appsconversationscreate-name)
* [`@vonage/cli-plugin-conversations apps:conversations:delete [CONVERSATIONID]`](#vonagecli-plugin-conversations-appsconversationsdelete-conversationid)
* [`@vonage/cli-plugin-conversations apps:conversations:members [CONVERSATIONID]`](#vonagecli-plugin-conversations-appsconversationsmembers-conversationid)
* [`@vonage/cli-plugin-conversations apps:conversations:members:add [CONVERSATIONID] [USERID]`](#vonagecli-plugin-conversations-appsconversationsmembersadd-conversationid-userid)
* [`@vonage/cli-plugin-conversations apps:conversations:members:remove [CONVERSATIONID] [MEMBERID]`](#vonagecli-plugin-conversations-appsconversationsmembersremove-conversationid-memberid)
* [`@vonage/cli-plugin-conversations apps:conversations:members:show [CONVERSATIONID] [MEMBERID]`](#vonagecli-plugin-conversations-appsconversationsmembersshow-conversationid-memberid)
* [`@vonage/cli-plugin-conversations apps:conversations:show [CONVERSATIONID]`](#vonagecli-plugin-conversations-appsconversationsshow-conversationid)
* [`@vonage/cli-plugin-conversations apps:conversations:update [CONVERSATIONID]`](#vonagecli-plugin-conversations-appsconversationsupdate-conversationid)
* [`@vonage/cli-plugin-conversations apps:users:conversations [USERID]`](#vonagecli-plugin-conversations-appsusersconversations-userid)

## `@vonage/cli-plugin-conversations apps:conversations`

Show all conversations

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Show all conversations
```

_See code: [dist/commands/apps/conversations/index.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/index.js)_

## `@vonage/cli-plugin-conversations apps:conversations:create [NAME]`

Create conversations

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:create [NAME] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>] [--display_name <value>] [--image_url <value>] [--ttl <value>]

FLAGS
  --display_name=<value>
  --image_url=<value>
  --ttl=<value>

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Create conversations
```

_See code: [dist/commands/apps/conversations/create.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/create.js)_

## `@vonage/cli-plugin-conversations apps:conversations:delete [CONVERSATIONID]`

Delete a conversation

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:delete [CONVERSATIONID] [--apiKey <value> --apiSecret <value>] [--appId
    <value> --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Delete a conversation
```

_See code: [dist/commands/apps/conversations/delete.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/delete.js)_

## `@vonage/cli-plugin-conversations apps:conversations:members [CONVERSATIONID]`

View all members in a conversation

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:members [CONVERSATIONID] [--apiKey <value> --apiSecret <value>] [--appId
    <value> --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  View all members in a conversation
```

_See code: [dist/commands/apps/conversations/members/index.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/members/index.js)_

## `@vonage/cli-plugin-conversations apps:conversations:members:add [CONVERSATIONID] [USERID]`

Add user to conversation

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:members:add [CONVERSATIONID] [USERID] [--apiKey <value> --apiSecret <value>]
    [--appId <value> --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Add user to conversation
```

_See code: [dist/commands/apps/conversations/members/add.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/members/add.js)_

## `@vonage/cli-plugin-conversations apps:conversations:members:remove [CONVERSATIONID] [MEMBERID]`

Remove a user from a conversation

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:members:remove [CONVERSATIONID] [MEMBERID] [--apiKey <value> --apiSecret
    <value>] [--appId <value> --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Remove a user from a conversation
```

_See code: [dist/commands/apps/conversations/members/remove.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/members/remove.js)_

## `@vonage/cli-plugin-conversations apps:conversations:members:show [CONVERSATIONID] [MEMBERID]`

Show specific member

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:members:show [CONVERSATIONID] [MEMBERID] [--apiKey <value> --apiSecret
    <value>] [--appId <value> --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Show specific member
```

_See code: [dist/commands/apps/conversations/members/show.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/members/show.js)_

## `@vonage/cli-plugin-conversations apps:conversations:show [CONVERSATIONID]`

Show conversation details

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:show [CONVERSATIONID] [--apiKey <value> --apiSecret <value>] [--appId
    <value> --keyFile <value>]

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Show conversation details
```

_See code: [dist/commands/apps/conversations/show.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/show.js)_

## `@vonage/cli-plugin-conversations apps:conversations:update [CONVERSATIONID]`

Modify a conversation

```
USAGE
  $ @vonage/cli-plugin-conversations apps:conversations:update [CONVERSATIONID] [--apiKey <value> --apiSecret <value>] [--appId
    <value> --keyFile <value>] [--name <value>] [--display_name <value>] [--image_url <value>] [--ttl <value>]

FLAGS
  --display_name=<value>
  --image_url=<value>
  --name=<value>
  --ttl=<value>

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>

DESCRIPTION
  Modify a conversation
```

_See code: [dist/commands/apps/conversations/update.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/conversations/update.js)_

## `@vonage/cli-plugin-conversations apps:users:conversations [USERID]`

```
USAGE
  $ @vonage/cli-plugin-conversations apps:users:conversations [USERID] [--apiKey <value> --apiSecret <value>] [--appId <value>
    --keyFile <value>] [--date_start <value>] [--date_end <value>] [--page_size <value>] [--order <value>] [--cursor
    <value>]

FLAGS
  --cursor=<value>
  --date_end=<value>
  --date_start=<value>
  --order=<value>
  --page_size=<value>

VONAGE API FLAGS FLAGS
  --apiKey=<value>
  --apiSecret=<value>

VONAGE APPLICATION FLAGS FLAGS
  --appId=<value>
  --keyFile=<value>
```

_See code: [dist/commands/apps/users/conversations.js](https://github.com/Vonage/vonage-cli/blob/v1.0.2-alpha.0/dist/commands/apps/users/conversations.js)_
<!-- commandsstop -->
