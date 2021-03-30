import BaseCommand from '@vonage/cli-utils';
import { OutputFlags } from '@oclif/parser';
import cli from 'cli-ux'


export default class GenerateJWT extends BaseCommand {
    static description = 'generate a Vonage JWT token'

    static examples = []
    static flags: OutputFlags<typeof BaseCommand.flags> = {
        ...BaseCommand.flags,
    }

    async run() {
        const flags = this.parsedFlags
        // this.vonage.generateJwt()
    }

}


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