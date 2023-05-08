import { ConfigEnv, ConfigParams } from '../enums';
import { ConfigData } from '../types';

export const envConfig = (): ConfigData => ({
  [ConfigParams.API_KEY]: process.env[ConfigEnv.API_KEY],
  [ConfigParams.API_SECRET]: process.env[ConfigEnv.API_SECRET],
  [ConfigParams.PRIVATE_KEY]: process.env[ConfigEnv.PRIVATE_KEY],
  [ConfigParams.APPLICATION_ID]: process.env[ConfigEnv.APPLICATION_ID],
});
