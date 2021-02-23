import { Hook } from '@oclif/config'
import { Console } from 'console';
import * as fs from 'fs-extra'
import * as path from 'path'

async function isExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
};

async function writeFile(filePath, data) {
    try {
        const dirname = path.dirname(filePath);
        let exist = await isExists(dirname);
        if (!exist) {
            await fs.mkdir(dirname, { recursive: true });
        }

        exist = await isExists(filePath);
        if (!exist) {
            await fs.writeFile(filePath, JSON.stringify({ apiKey: '', apiSecret: '' }, null, 2), 'utf8');
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