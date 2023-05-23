export class ConfigFileMissing extends Error {
  constructor() {
    super('The config file is missing');
  }
}
