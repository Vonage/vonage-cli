import { NumberCommand } from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';

import cli from 'cli-ux'

export default class NumberList extends NumberCommand {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number
list all numbers
`,
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
    let numberData = await this.allNumbers;
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
    this.exit();
  }
}
