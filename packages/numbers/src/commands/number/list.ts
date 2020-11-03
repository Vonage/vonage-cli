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
    features: flags.string({char: 'f', description: 'comma separate list of number features'}),
  }

  async run() {
    const {flags} = this.parse(List)
    const numbers = new Numbers()

    numbers.list(flags)
  }
}
