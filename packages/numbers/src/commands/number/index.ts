import {Command, flags} from '@oclif/command'
import Numbers from '../../libs/numbers'

export default class NumbersList extends Command {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number
list all numbers
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    features: flags.string({char: 'f', description: 'comma separate list of number features'}),
  }

  async run() {
    const { flags } = this.parse(NumbersList)
    const numbers = new Numbers()

    numbers.list(flags)
  }
}
