import {Command, flags} from '@oclif/command'
import Numbers from '../../libs/numbers'

export default class List extends Command {
  static description = 'list vonage number'

  static examples = [
    `$ vonage number:list
list all numbers
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    app: flags.boolean({char: 'n', description: 'list app numbers'}),
    sip: flags.boolean({char: 't', description: 'list sip numbers'}),
    sms: flags.boolean({char: 's', description: 'list sms numbers'}),
    tel: flags.boolean({char: 't', description: 'list tel numbers'}),
  }

  async run() {
    const {flags} = this.parse(List)
    const numbers = new Numbers()

    if (flags.app) {
      this.log(numbers.list('app'))
    } else if (flags.sip) {
      this.log(numbers.list('sip'))
    } else if (flags.sms) {
      this.log(numbers.list('sms'))
    } else if (flags.tel) {
      this.log(numbers.list('tel'))
    } else {
      this.log(numbers.list('all'))
    }
  }
}
