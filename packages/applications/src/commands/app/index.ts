import Command from '../base'
import cli from 'cli-ux'

// to-do - capabilities presentation not ideal

export default class ApplicationsList extends Command {
    static description = 'manage Vonage applications'

    static examples = [
        `$ vonage apps
hello world from ./src/hello.ts!
`,
    ]

    static flags = {
        ...Command.flags,
        ...cli.table.flags({
            except: ['columns', 'no-truncate', 'csv']
        })
    }

    static args = [
        {name: 'appId', required: false},
    ]

    async run() {

        const {args, flags} = this.parse(ApplicationsList)
        let appData = await this.allApplications;
        let appList = appData['_embedded'].applications;

        cli.table(appList, {
            name: {},
            id: {},
            capabilities: {
                get: row => Object.keys(row['capabilities']).toString(),
            }
        }, {
            ...flags
        })

    }

    async catch(error:any) {
        if (error.oclif.exit !== 0){
            this.log(`${error.name}: ${error.message}`)
        }
    }
}
