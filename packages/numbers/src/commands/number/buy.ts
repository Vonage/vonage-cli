import {cli} from 'cli-ux'
import {Command, flags} from '@oclif/command'
import Numbers from '../../libs/numbers'

export default class NumbersSearch extends Command {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number
list all numbers
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    features: flags.string({char: 'f', description: 'comma separate list of number features'}),
    limit: flags.integer({char: 'l', default: 10})
  }

  async run() {
    const { flags } = this.parse(NumbersSearch)
    const numbers = new Numbers()

    cli.log(numbers.buy(flags))
  }
}
