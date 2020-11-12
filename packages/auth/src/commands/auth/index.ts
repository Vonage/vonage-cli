import {Command, flags} from '@oclif/command'
import * as fs from 'fs'

export default class AuthIndex extends Command {
    static description = 'manage authentication details'

    static examples = [
        `$ vonage auth
Global credentials:
API Key: GlobalAPIKey API Secret: Gl*********
Local credentials:
API Key: LocalAPIKey API Secret: Lo*******
`,
    ]

    maskSecret(apiSecret: string) {
        const show = 2
        const mask = '*'
        return apiSecret.slice(0, show) + mask.repeat(apiSecret.length - show)
    }

  async run() {
        const fileName = '.vonagerc'
        const key = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
        const globalFilePath = `${process.env[key]}/${fileName}`
        const localFilePath = `${process.cwd()}/${fileName}`
        this.log(`Global\n==========`)
        try {
            const globalCreds = JSON.parse(
                fs.readFileSync(globalFilePath, 'utf8')
            )
            this.log(
              `API Key: ${globalCreds.api_key}\nAPI Secret: ${this.maskSecret(
                    globalCreds.api_secret
              )}`
            )
        } catch (err) {
            this.log('No global credentials found.')
        }
        this.log('\nLocal\n==========')
        try {
            const localCreds = JSON.parse(
                fs.readFileSync(localFilePath, 'utf8')
            )
          this.log(
              `API Key: ${localCreds.api_key}\nAPI Secret: ${this.maskSecret(
                   localCreds.api_secret
               )}`
          )
        } catch (err) {
            this.log('No local credentials found.')
        }
    }
}
