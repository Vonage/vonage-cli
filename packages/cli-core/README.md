# Vonage Core CLI

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/vonage/vonage-cli/ci.yml?branch=3.x) [![Codecov](https://img.shields.io/codecov/c/github/vonage/vonage-cli?label=Codecov&logo=codecov&style=flat-square)](https://codecov.io/gh/Vonage/vonage-cli) ![Latest Release](https://img.shields.io/npm/v/@vonage/cli-core?label=%40vonage%2Fcli&style=flat-square) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-square)](../../CODE_OF_CONDUCT.md) [![License](https://img.shields.io/npm/l/@vonage/cli-core?label=License&style=flat-square)][license]

<img src="https://developer.nexmo.com/images/logos/vbc-logo.svg" height="48px" alt="Vonage" />

This is the core package for all Vonage CLI commands. It contians the base `VonageCommand`, `VonageConfig`, common User Experience (UX), and Filesystem (fs) functionality. Since this pacakge contains the config functionality, it also adds configuration commands to the CLI.

## VonageCommand

The `VonageCommand` base class, provides global CLI arguments which can be used to configure [`@vonage/auth`](https://github.com/Vonage/vonage-node-sdk/tree/3.x/packages/auth) and [`@vonage/server-sdk`](https://github.com/Vonage/vonage-node-sdk/tree/3.x/packages/server-sdk). Along with the configuration, standard UX functions for outputting data is also provided. Keeping a consistent UX is pivitol for the CLI so it is recommended that you use these functions. 

## Configuration

Config settings are parsed into the CLI in four ways (in order):

1. From command line arguments, (`--api-key`,`--api-secret`, `--private-key`, and `--application-id`)
1. Reading in from `$CWD/vonage_app.json` file
1. The `VONAGE_API_KEY`, `VONAGE_API_SECRET`, `VONAGE_PRIVATE_KEY`, and `VONAGE_APPLICATION_ID` environment variables 
1. A Global config file loacated at `$XDG_CONFIG_HOME/@vonage/cli/vonage.config.json`


### Configuration API

By having your command extend `VonageCommand` you will get access to the base configuration parameters. It is recommened that you do not interact While you shouldn't need to access variables directly, the best way is to use `vonageConfig.getVar(<which>)` from the `VonageCommand` base class. `VonageConfig` also exposes methods from saving the global or local config (again these are use at your own risk)

## Commands Provided

1. `vonage config` (`vonage config:setup`, `vonage setup`): Initial configuration setup wizard
1. `vonage config:show`: A utility command that displays the configuration
1. `vonage config:set SETTING VALUE` A utility command to set an individual configuration setting 

[license]: LICENSE.txt
[signup]: https://dashboard.nexmo.com/sign-up?utm_source=DEV_REL&utm_medium=github&utm_campaign=node-cli#

