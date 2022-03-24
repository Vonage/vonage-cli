import NumberCommand from '../../number_base';
import { OutputFlags } from '@oclif/parser';
import { ArgInput } from '@oclif/core/lib/interfaces';

import cli from 'cli-ux'

export default class NumberList extends NumberCommand<typeof NumberList.flags> {
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

  static args: ArgInput = []

  async run() {
    const flags = this.parsedFlags;
    let numberData = await this.getAllNumbers({});
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
  }

  async catch(error: any) {
    return super.catch(error);
  }
}
