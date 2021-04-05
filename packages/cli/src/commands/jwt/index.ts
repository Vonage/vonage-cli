import BaseCommand from '@vonage/cli-utils';
import { OutputFlags, OutputArgs } from '@oclif/parser';
import cli from 'cli-ux'


export default class GenerateJWT extends BaseCommand {
    static description = 'generate a Vonage JWT token'

    static examples = []

    static flags = {
        ...BaseCommand.flags,
    }

    static args = [
        { name: 'appId', required: false },
    ]

    async run() {
        const flags = this.parsedFlags
        const args = this.parsedArgs
        console.log(args)

        try {
            let jwt = await this.vonage.generateJwt()
        } catch (error) {
            // console.log(error)
            this.error(new Error("whoops"), { code: 'xyz', ref: 'testing', suggestions: ['something', 'another thing'] })
            // this.error(message: string | Error, options ?: { code?: string, exit?: number, ref?: string; suggestions?: string[]; })
        }


        // if (!appId) {
        //     this.warn("Please provide application id.");
        // }
        // this.log(jwt)

    }

    // async catch(error: any) {

    //     return super.catch(error)
    // }
}


// Error code
// Error title
// Error description(Optional)
// How to fix the error
// URL for more information

// {
//     "iat": 1532093588,
//         "jti": "705b6f50-8c21-11e8-9bcb-595326422d60",
//             "sub": "alice",
//                 "exp": "1532179987",
//                     "acl": {
//         "paths": {
//             "/*/users/**": { },
//             "/*/conversations/**": { },
//             "/*/sessions/**": { },
//             "/*/devices/**": { },
//             "/*/image/**": { },
//             "/*/media/**": { },
//             "/*/applications/**": { },
//             "/*/push/**": { },
//             "/*/knocking/**": { },
//             "/*/legs/**": { }
//         }
//     },
//     "application_id": "aaaaaaaa-bbbb-cccc-dddd-0123456789ab"
// }