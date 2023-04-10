import { VonageCommand } from '../../vonageCommand';
import {logo} from '../../logo';

export default class Config extends VonageCommand<typeof Config> {
  public async run(): Promise<void> {
    this.log(logo);
  }
}
