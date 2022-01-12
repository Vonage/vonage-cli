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
$ oclif-example COMMAND
running command...
$ oclif-example (-v|--version|version)
@vonage/cli-plugin-conversations/1.0.0-beta.14 linux-x64 node-v12.18.2
$ oclif-example --help [COMMAND]
USAGE
  $ oclif-example COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`oclif-example apps:conversations`](#oclif-example-appsconversations)
* [`oclif-example apps:conversations:create [NAME]`](#oclif-example-appsconversationscreate-name)
* [`oclif-example apps:conversations:delete [CONVERSATIONID]`](#oclif-example-appsconversationsdelete-conversationid)
* [`oclif-example apps:conversations:members [CONVERSATIONID]`](#oclif-example-appsconversationsmembers-conversationid)
* [`oclif-example apps:conversations:members:add [CONVERSATIONID] [USERID]`](#oclif-example-appsconversationsmembersadd-conversationid-userid)
* [`oclif-example apps:conversations:members:remove [CONVERSATIONID] [MEMBERID]`](#oclif-example-appsconversationsmembersremove-conversationid-memberid)
* [`oclif-example apps:conversations:members:show [CONVERSATIONID] [MEMBERID]`](#oclif-example-appsconversationsmembersshow-conversationid-memberid)
* [`oclif-example apps:conversations:show [CONVERSATIONID]`](#oclif-example-appsconversationsshow-conversationid)
* [`oclif-example apps:conversations:update [CONVERSATIONID]`](#oclif-example-appsconversationsupdate-conversationid)
* [`oclif-example apps:users:conversations [USERID]`](#oclif-example-appsusersconversations-userid)

## `oclif-example apps:conversations`

Show all conversations

```
USAGE
  $ oclif-example apps:conversations

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/conversations/index.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/index.js)_

## `oclif-example apps:conversations:create [NAME]`

Create conversations

```
USAGE
  $ oclif-example apps:conversations:create [NAME]

OPTIONS
  -h, --help                   show CLI help
  --display_name=display_name
  --image_url=image_url
  --ttl=ttl
```

_See code: [dist/commands/apps/conversations/create.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/create.js)_

## `oclif-example apps:conversations:delete [CONVERSATIONID]`

Delete a conversation

```
USAGE
  $ oclif-example apps:conversations:delete [CONVERSATIONID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/conversations/delete.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/delete.js)_

## `oclif-example apps:conversations:members [CONVERSATIONID]`

View all members in a conversation

```
USAGE
  $ oclif-example apps:conversations:members [CONVERSATIONID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/conversations/members/index.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/members/index.js)_

## `oclif-example apps:conversations:members:add [CONVERSATIONID] [USERID]`

Add user to conversation

```
USAGE
  $ oclif-example apps:conversations:members:add [CONVERSATIONID] [USERID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/conversations/members/add.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/members/add.js)_

## `oclif-example apps:conversations:members:remove [CONVERSATIONID] [MEMBERID]`

Remove a user from a conversation

```
USAGE
  $ oclif-example apps:conversations:members:remove [CONVERSATIONID] [MEMBERID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/conversations/members/remove.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/members/remove.js)_

## `oclif-example apps:conversations:members:show [CONVERSATIONID] [MEMBERID]`

Show specific member

```
USAGE
  $ oclif-example apps:conversations:members:show [CONVERSATIONID] [MEMBERID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/conversations/members/show.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/members/show.js)_

## `oclif-example apps:conversations:show [CONVERSATIONID]`

Show conversation details

```
USAGE
  $ oclif-example apps:conversations:show [CONVERSATIONID]

OPTIONS
  -h, --help  show CLI help
```

_See code: [dist/commands/apps/conversations/show.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/show.js)_

## `oclif-example apps:conversations:update [CONVERSATIONID]`

Modify a conversation

```
USAGE
  $ oclif-example apps:conversations:update [CONVERSATIONID]

OPTIONS
  -h, --help                   show CLI help
  --display_name=display_name
  --image_url=image_url
  --name=name
  --ttl=ttl
```

_See code: [dist/commands/apps/conversations/update.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/conversations/update.js)_

## `oclif-example apps:users:conversations [USERID]`

```
USAGE
  $ oclif-example apps:users:conversations [USERID]

OPTIONS
  -h, --help               show CLI help
  --cursor=cursor
  --date_end=date_end
  --date_start=date_start
  --order=order
  --page_size=page_size
```

_See code: [dist/commands/apps/users/conversations.js](https://github.com/Vonage/vonage-cli/blob/v1.0.0-beta.14/dist/commands/apps/users/conversations.js)_
<!-- commandsstop -->
