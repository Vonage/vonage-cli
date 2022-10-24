import { Hook } from '@oclif/core';
import { promises as fs } from 'fs';
import { writeFileSync, constants } from 'fs';
import * as path from 'path';
import shell from 'shelljs';

async function isExists(path: string) {
    try {
        // FIXME use builtin
        await fs.access(path, constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

async function writeFile(filePath: string) {
    try {
        const dirname = path.dirname(filePath);
        let exist = await isExists(dirname);

        if (!exist) {
            // FIXME use path instead of shell
            await shell.mkdir('-p', dirname);
        }

        exist = await isExists(filePath);
        if (!exist) {
            writeFileSync(
                filePath,
                JSON.stringify({ apiKey: '', apiSecret: '' }, null, 2),
                'utf8',
            );
        }
    } catch (err) {
        throw new Error(err);
    }
}

// prettier-ignore
const hook: Hook<'init'> = async function(options) {
    // eslint-disable-next-line no-invalid-this
    const name = path.join(this.config.configDir, 'vonage.config.json');
    writeFile(name);
    return;
};

export default hook;
