# Vonage CLI

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vonage/vonage-cli/ci.yml)
![Codecov](https://img.shields.io/codecov/c/github/vonage/vonage-cli?label=Codecov&logo=codecov&style=flat-square)
![Latest Release](https://img.shields.io/npm/v/@vonage/cli?label=%40vonage%2Fcli&style=flat-square)
![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-square)
![License](https://img.shields.io/npm/l/@vonage/cli?label=License&style=flat-square)

<img src="https://developer.vonage.com/images/logos/vbc-logo.svg" height="48px" alt="Vonage" />

This is the Vonage CLI for [Vonage APIs](https://developer.vonage.com/).

To use it you will need a [free Vonage developer account](https://developer.vonage.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=node-cli).

The Vonage CLI has many commands that can bootstrap with Vonage's APIs. While you can use the dashboard to accomplish
many CLI tasks, you can also programmatically set up and configure your application on your server. Already have a
Voange application configured? The CLI can help you quickly export the configuration into JSON or YAML to consume in
your program.

## What's New in Version 3

Those new to the CLI can skip this section. The latest version 3 of the CLI offers a ground-up, pragmatic design to
address some of the shortcomings of versions past.

### Standardized Flags

All flags in the Vonage CLI now use **kebab-case**, ensuring consistency and making commands more straightforward.

### JSON and YAML Output Support

You can now specify the output format of commands using JSON or YAML, providing flexibility to integrate with your
tools and workflows.

### Grouped Commands by Action

Commands are organized by action to enhance usability and make it easier to find the functionality you need.

### Built with yargs

Version 3 is built from the ground up using the [yargs](https://yargs.js.org/) package, providing a robust and
user-friendly experience.

### Easier configuration

Configuration for the CLI has been simplified to make it easier to work within a Vonage application or Vonage Account.
See below for more information on how to configure the CLI

### Automatic updates

Version 3 will periodically check for new updates and inform you when to upgrade. This will ensure that you are
calling the Voange APIs correctly and that the tool is bug-free for you.

## Installation

The Vonage CLI is written with [NodeJS](https://nodejs.org) and utilizes the
[@vonage/server-sdk](https://github.com/vonage/vonage-node-sdk) package. The CLI will always work with the lowest Long Term
Supported (LTS) [version](https://nodejs.org/en/about/previous-releases) of NodeJS (currently 18.20).

### Installing with npm

To install the Vonage CLI using `npm`, run the following command:

```shell
npm install -g @vonage/cli
```

### Installing with yarn

To install the Vonage CLI using `yarn`,

```shell
yarn global add @vonage/cli
```

## Global Flags

The Vonage CLI provides a set of global flags that are available for all commands:

- `--verbose`: Print more information.
- `--debug`: Print debug information.
- `--no-color`: Toggle color output off.
- `--help`: Show help.

`verbose` and `debug` information will be written to `STDERR` to allow piping output into other programs

## Authentication

The Vonage CLI uses a flexible configuration system to manage your API credentials. It supports local or global
configuration files and command-line flags for overriding these values, allowing you to tailor your setup based on
your project needs or personal preferences.

### Configuration

The CLI will load the configuration in the following order:

1. Command line flags `--api-key`, `--api-secret`, `--private-key`, and `--app-id`.
2. A local configuration file in the current working directory `.vonagerc`.
3. A global configuration file in the `.vonage` folder in your home directory `$HOME/.vonage/config.json`.

> **Note:** Only the CLI will read these values from .vonagerc. The Vonage SDKs requires separate initialization with
> its own credentials.

> **Note**: The contents of the private key, will be stored inside the configuration file. This is by design to help
> ensure the key is not overwritten when new keys are generated.

**Flags**:

- `--api-key` The API key found in the "API settings" section of your dashboard
- `--api-secret` The API secret found in the "API Settings" section of your dashboard
- `--app-id` The ID of the application to use. This is found in the "Applications" section of the dashboard or
  outputted with `vonage apps`
- `--private-key` The path or contents of the private key. The Private key can only be accessed when the application
  is created or when you regenerate the keys in the dashboard

### Set Authentication

While you can use the CLI without configuring it, you will be required to pass in the flags when running a command.
Using the `vonage auth set` command  is recommended to save you from typing them every time you run a command.

**Flags**:

This command uses the [global authentication flags](#configuration)

**Examples**:

Configure your Vonage API credentials:

```shell
vonage auth set \
--api-key='your-api-key' \
--api-secret='your-api-secret' \
--app-id='your-application-id' \
--private-key=/path/to/private.key
```

> **Note**: running `vonage auth set` will not remove current values. Therefore, you can set just the API Key/Secret or
> App ID/Private Key individually. However, you will not be able to set the App ID and Private key without having
> the API key and secret set. This is due to how the command checks the credentials are valid.

> **Note**: This command will also check the credentials are correct before committing.

### Check Authentication

Verify that your authentication details are valid. By default, this will use the global configuration file. Checking
credentials works as follows:

1. The API Key and secret are checked by making a call to list the applications using the
   [Applications API](/application/overview).
2. The App ID and Private key are validated by fetching the application information and using the public key along with the private key to ensure they are paired correctly.

> Note: This command will not use the command line arguments. It will ony check the configuration files

**Flags**:

- `--local`: Use the local configuration file (`.vonagerc`).

**Examples**:

Check the global configuration:
```shell
vonage auth check
```

Check the local configuration:
```shell
vonage auth check --local
```

### Show Authentication

Display your current authentication configuration. This follows the configuration loading mentioned
[above](#configuration) and lets you know which configuration file the CLI is using.

> **Note**: This command will also check the credentials are correct.

**Flags**:

- `--show-all`: Show non-redacted private key and API secret.
- `--yaml`: Output in YAML format.
- `--json`: Output in JSON format.

**Examples**:

Show the configuration
```shell
vonage auth show
```

## Using the CLI

### Viewing Available Commands

Commands are grouped by product or action. To view a list of available commands, just run `vonage` without any arguments:

```shell
vonage

Commands:
  vonage apps [command]           Manage applications
  vonage auth [command]           Manage authentication information
  vonage balance                  Check your account balance
  vonage conversations [command]  Manage conversations
  vonage jwt <command>            Manage JWT tokens
  vonage members [command]        Manage applications
  vonage numbers [command]        Manage numbers
  vonage users [command]          Manage users
```

Use the `--help` flag with a command to get more information on how to use:

```shell
vonage apps --help
```

## Need Help?

If you encounter any issues or need help, please join our [community Slack channel](/community/slack)
