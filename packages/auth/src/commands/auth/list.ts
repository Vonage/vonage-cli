import {Command} from '@oclif/command'
import * as fs from 'fs'

export default class List extends Command {
  static description = 'lists Global and Local API Keys and Secrets'

  static examples = [
    `$ vonage auth:list
Global credentials:
API Key: GlobalAPIKey API Secret: Gl*********
Local credentials:
API Key: LocalAPIKey API Secret: Lo*******
`,
  ]

  maskSecret(apiSecret:string){
    const show = 2;
    const mask = '*'
    return apiSecret.slice(0,show)+mask.repeat(apiSecret.length-show);
  }

  async run() {
    const fileName = '.vonagerc'
    const key = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME'
    const globalFilePath = `${process.env[key]}/${fileName}`
    const localFilePath = `${process.cwd()}/${fileName}`
    this.log('Global credentials:')
    try {
      const globalCreds = JSON.parse(fs.readFileSync(globalFilePath,'utf8'))
      this.log(`API Key: ${globalCreds.api_key} API Secret: ${this.maskSecret(globalCreds.api_secret)}`)
    } catch (err) {
      this.log('No global credentials found.')
    }
    this.log('Local credentials:')
    try {
      const localCreds = JSON.parse(fs.readFileSync(localFilePath,'utf8'))
      this.log(`API Key: ${localCreds.api_key} API Secret: ${this.maskSecret(localCreds.api_secret)}`)
    } catch (err) {
      this.log('No local credentials found.')
    }
  }
}
