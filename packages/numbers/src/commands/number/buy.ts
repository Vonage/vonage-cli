import {cli} from 'cli-ux'
import {Command, flags} from '@oclif/command'
import Numbers from '../../libs/numbers'
import NumbersSearch from './search'

export default class NumbersBuy extends Command {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number
list all numbers
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    features: flags.string({char: 'f', description: 'comma separate list of number features'}),
    number: flags.string({char: 'l'})
  }

  async run() {
    const { flags } = this.parse(NumbersBuy)
    const numbers = new Numbers()

    if (!flags.number) {
      const number = numbers.search({ limit: 1 })
      cli.log(numbers.buy({...flags, number: number[0].msisdn}))
    } else {
      cli.log(numbers.buy(flags))
    }
  }
}
