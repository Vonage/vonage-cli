import { Hook } from '@oclif/config'
import * as fs from 'fs-extra'
import * as path from 'path'
import shell from 'shelljs';

async function isExists(path: any) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
};

// 

async function writeFile(filePath: any, data: any) {
    try {
        const dirname = path.dirname(filePath);
        let exist = await isExists(dirname);
        if (!exist) {
            await shell.mkdir('-p', dirname);
        }

        exist = await isExists(filePath);
        if (!exist) {

            await fs.writeFile(filePath, JSON.stringify({ apiKey: '', apiSecret: '', appId: '', privateKey: '' }, null, 2), 'utf8');
        }

    } catch (err) {
        throw new Error(err);
    }
}

const hook: Hook<'init'> = async function (options) {
    let name = path.join(this.config.configDir, 'vonage.config.json');
    await writeFile(name, '');
    return;
}

export default hook;