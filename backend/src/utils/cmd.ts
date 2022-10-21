import { exec } from 'child_process';


async function execFunc(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(cmd, { maxBuffer: 1024 * 40 }, (error, stdout, stderr) => {
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

const CMD = {
    exec: execFunc
};

export {
    CMD
};
