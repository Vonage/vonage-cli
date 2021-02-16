import {cli} from 'cli-ux'
import {Command, flags} from '@oclif/command'
import Numbers from '../../libs/numbers'

export default class NumbersList extends Command {
  static description = 'manage Vonage numbers'

  static examples = [
    `$ vonage number
Msisdn          Country  Type        Features 
(032) 475-0014  GB       mobile-lvn  sms      
(343) 078-3910  GB       mobile-lvn  sms      
(280) 578-6440  GB       mobile-lvn  sms      
(871) 993-4907  GB       mobile-lvn  voice    
(451) 930-6591  GB       mobile-lvn  sms
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    features: flags.string({char: 'f', description: 'comma separate list of number features'}),
  }

  async run() {
    const { flags } = this.parse(NumbersList)
    const numbers = new Numbers()


    cli.table(numbers.list(flags), {
      msisdn: {},
      country: {},
      type: {},
      features: {},
    }, {})
  }
}
