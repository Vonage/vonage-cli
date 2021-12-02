import NumberCommand from '../../number_base';
import { OutputFlags } from '@oclif/parser';

import cli from 'cli-ux'

export default class NumberList extends NumberCommand {
  static description = 'manage your Vonage numbers'

  static examples = [
    `vonage number`,
  ]

  static flags: OutputFlags<typeof NumberCommand.flags> = {
    ...NumberCommand.flags,
    ...cli.table.flags({
      except: ['columns', 'no-truncate', 'csv']
    })
  }

  static args = []

  async run() {
    const flags = this.parsedFlags as OutputFlags<typeof NumberList.flags>
    let numberData;
    try {
      numberData = await this.getAllNumbers({});
    } catch (error) {
      console.log(error)
    }


    try {
      cli.table(numberData.numbers, {
        country: {},
        msisdn: {
          header: "Number"
        },
        type: {},
        features: {
          get: (row: any) => row.features.join(',')
        },
        app_id: {
          header: "Application",
          get: (row: any) => row.app_id || ""
        }
      }, {
        ...flags
      });
    } catch (error) {
      this.error('No results found.')
    }

    this.exit();
  }

  async catch(error: any) {
    return super.catch(error);
  }
}
