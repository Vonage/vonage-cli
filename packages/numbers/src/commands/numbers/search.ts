import NumberCommand from '../../number_base';
import { OutputFlags, OutputArgs } from '@oclif/parser';
import { flags } from '@oclif/command';

import cli from 'cli-ux'


//TODO - INTERACTIVE MODE
//Add in ISO look up for Country codes
//var countries = require("i18n-iso-countries");
//console.log(countries.getNames("en", {select: "official"}));

interface searchFlags {
  type?: any,
  startsWith?: any,
  endsWith?: any,
  contains?: any
  features?: any
}

interface searchArgs {
  countryCode?: string
}


export default class NumberSearch extends NumberCommand {
  static description = 'search for available Vonage numbers'

  static examples = [
    `vonage numbers:search US`,
    `vonage numbers:search US --startsWith=1555`,
    `vonage numbers:search US --features=VOICE,SMS --endsWith=1234`
  ]

  static flags: OutputFlags<typeof NumberCommand.flags> & searchFlags = {
    ...NumberCommand.flags,
    'type': flags.string({
      description: 'Filter by type of number, such as mobile or landline',
      options: ['landline', 'mobile-lvn', 'landline-toll-free']
    }),
    'startsWith': flags.string({
      description: 'Search for numbers that start with certain numbers.',
      exclusive: ['endsWith', 'contains']
    }),
    'endsWith': flags.string({
      description: '',
      exclusive: ['startsWith', 'contains']
    }),
    'contains': flags.string({
      description: '',
      exclusive: ['endsWith', 'startsWith']
    }),
    'features': flags.string({
      description: ''
    })
  }

  static args: OutputArgs<typeof NumberCommand.args> = [
    { name: 'countryCode', required: false }
  ]

  async run() {
    const flags = this.parsedFlags as OutputFlags<typeof NumberCommand.flags> & searchFlags
    const args = this.parsedArgs! as OutputArgs<typeof NumberCommand.args> & searchArgs;

    let resp = await this.numberSearch(args.countryCode, flags);

    try {
      cli.table(resp.numbers, {
        country: {},
        msisdn: {
          header: "Number"
        },
        type: {},
        cost: {},
        features: {
          get: (row: any) => row.features.join(',')
        }
      }, {
        ...flags
      });
    } catch (error) {
      this.error('No results found.');
    }


    this.exit();
  }

  async catch(error: any) {
    return super.catch(error);
  }
}