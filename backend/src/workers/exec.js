import { exec } from 'child_process';

export async function execCmd(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 1024 * 9999999 }, (error, stdout, stderr) => {
            if (error) {
                reject(`error: ${error.message}`);
                return;
            }

            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
};
