import {cli} from 'cli-ux'
import * as inquirer from 'inquirer'
import {Command, flags} from '@oclif/command'
import Numbers from '../../libs/numbers'

export default class NumbersList extends Command {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number:list --limit 1
Msisdn          Country  Type        Features 
(196) 125-6464  GB       mobile-lvn  voice
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    features: flags.string({char: 'f', description: 'comma separate list of number features'}),
    limit: flags.integer({char: 'l', default: 10})
  }

  async run() {
    const { flags } = this.parse(NumbersList)
    const numbers = new Numbers()

    cli.log

    try {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'number',
            message: 'Pick a number to purchase',
            choices: () => numbers.search(flags).map(n => n.msisdn),
          }
        ])
        .then(answers => {
          cli.log(numbers.buy({...flags, number: answers.number}))
        })
        .catch(error => {
          throw Error(error)
        })
    } catch (error) {
      throw Error(error)
    }
  }
}
