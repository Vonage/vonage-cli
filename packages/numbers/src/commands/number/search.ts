import { NumberCommand } from 'kja-cli-utils';
import { OutputFlags, OutputArgs } from '@oclif/parser';
import { flags } from '@oclif/command'

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

function parseFlags(flagData: searchFlags): any {
  let searchResponse = {}
  if (flagData.startsWith) {
    searchResponse['pattern'] = flagData.startsWith;
    searchResponse['search_pattern'] = 0
    delete flagData.startsWith
  }
  if (flagData.endsWith) {
    searchResponse['pattern'] = flagData.endsWith;
    searchResponse['search_pattern'] = 2
    delete flagData.endsWith
  }
  if (flagData.contains) {
    searchResponse['pattern'] = flagData.contains;
    searchResponse['search_pattern'] = 0
    delete flagData.contains
  }
  return Object.assign({}, flagData, searchResponse)
}

export default class NumberSearch extends NumberCommand {
  static description = 'manage Vonage numbers'

  static examples = []

  static flags: OutputFlags<typeof NumberCommand.flags> & searchFlags = {
    ...NumberCommand.flags,
    'type': flags.string({
      description: '',
      options: ['landline', 'mobile-lvn', 'landline-toll-free']
    }),
    'startsWith': flags.string({
      description: '',
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
    console.log(flags, args)
    let options = parseFlags(flags)
    let resp = await this.numberSearch(args.countryCode, options);
    // clean up response
    console.dir(resp, { depth: 4 })
  }
}