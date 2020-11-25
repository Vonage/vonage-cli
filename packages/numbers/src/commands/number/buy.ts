import {cli} from 'cli-ux'
import {Command, flags} from '@oclif/command'
import Numbers from '../../libs/numbers'

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
    'get-lucky': flags.boolean({char: 'l'})
  }

  static args = [
    {name: 'number'}
  ]

  async run() {
    const { flags, args } = this.parse(NumbersBuy)
    const numbers = new Numbers()

    try {
      if (args.number) {
        cli.log(numbers.buy({...flags, number: args.number}))
      } else if (flags['get-lucky']) {
        const number = numbers.search({ limit: 1 })
        cli.log(numbers.buy({...flags, number: number[0].msisdn}))
      } else {
        throw Error('Please use either a valid number i.e. `vonage number:buy 14155552671` or `vonage number:buy --get-lucky` to buy the first number we find.')
      }
    } catch (error) {
      throw Error(error)
    }
  }
}
