import { BaseSetCommand } from '../../config/baseSetCommand';
import { Args } from '@oclif/core';
import kebabcase from 'lodash.kebabcase';
import snakecase from 'lodash.snakecase';
import { ConfigParts, ConfigParams, DisplayedSetting } from '../../enums/index';

export default class SetConfig extends BaseSetCommand<typeof SetConfig> {
  static summary = 'Set config variable';

  static args = {
    setting: Args.string({
      description: 'The setting to set',
      options: Object.values(ConfigParams).map(kebabcase),
      required: true,
    }),
    value: Args.string({
      description: 'Value to set',
      required: true,
    }),
  };

  public async run(): Promise<void> {
    const { global } = this.flags;
    const { setting, value } = this.args;
    this.log(`Setting ${global ? 'global' : 'local'} ${setting} to: ${value}`);

    const currentSetting = this.vonageConfig.getVariableFrom(
      snakecase(setting).toUpperCase(),
      global ? 'global' : 'local',
    );

    this.log(`the current setting is ${currentSetting}`);
  }
}
