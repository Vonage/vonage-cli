import { Hook } from '@oclif/config'
import { promises as fs } from 'fs'
import { writeFileSync, constants } from 'fs'
import * as path from 'path'
import shell from 'shelljs';

async function isExists(path: any) {
    try {
        let result = await fs.access(path, constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
};

async function writeFile(filePath: any, data: any) {
    try {
        const dirname = path.dirname(filePath);
        let exist = await isExists(dirname);

        if (!exist) {
            await shell.mkdir('-p', dirname);
        }

        exist = await isExists(filePath);
        if (!exist) {
            writeFileSync(filePath, JSON.stringify({ apiKey: '', apiSecret: '' }, null, 2), 'utf8');
        }

    } catch (err) {
        throw new Error(err);
    }
}

const hook: Hook<'init'> = async function (options) {
    let name = path.join(this.config.configDir, 'vonage.config.json');
    writeFile(name, '');
    return;
}

export default hook;