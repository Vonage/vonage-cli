import {Command, flags} from '@oclif/command'
import cli from 'cli-ux'
import * as fs from 'fs'

export default class Setup extends Command {
  static description = 'sets API Key and Secret'

  static examples = [
    `$ vonage auth:setup --apikey=YOURAPIKEY --apisecret=YOURAPISECRET -l
Credentials written to /path/to/your/local/project/.vonagerc
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    local: flags.boolean({char: 'l', description: 'save credentials to local folder'}),
    apikey: flags.string({description: 'API key'}),
    apisecret: flags.string({description: 'API secret'}),
  }

  async run() {
    const {flags} = this.parse(Setup)
    let apiKey = flags.apikey
    let apiSecret = flags.apisecret
    if (!apiKey) {
      apiKey = await cli.prompt('What is your API key?')
    }
    if (!apiSecret) {
      apiSecret = await cli.prompt('What is your API secret?')
    }
    if (apiKey && apiSecret) {
      const key = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME'
      const filePath = flags.local ? process.cwd() : process.env[key]
      const fileName = '.vonagerc'
      fs.writeFileSync(`${filePath}/${fileName}`, JSON.stringify({api_key: apiKey, api_secret: apiSecret}))
      this.log(`Credentials written to ${filePath}/${fileName}`)
    }
  }
}
