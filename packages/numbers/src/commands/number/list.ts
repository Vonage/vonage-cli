import {Command, flags} from '@oclif/command'

export default class List extends Command {
  static description = 'list vonage numbers'

  static examples = [
    `$ vonage number:list
list of numbers?
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    app: flags.boolean({char: 'n', description: 'list app numbers'}),
    sms: flags.boolean({char: 's', description: 'list sms numbers'}),
    tel: flags.boolean({char: 't', description: 'list tel numbers'}),
    sip: flags.boolean({char: 't', description: 'list sip numbers'}),
  }

  async run() {
    const {flags} = this.parse(List)

    if (flags.app) {
      this.log('app list')
    } else if (flags.sms) {
      this.log('sms list')
    } else if (flags.tel) {
      this.log('tel list')
    } else if (flags.sip) {
      this.log('sip list')
    } else {
      this.log('list all numbers')
    }
  }
}
