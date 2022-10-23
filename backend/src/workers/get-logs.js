const execCmd = require('./exec');

process.on('message', async function (config) {

    let cmd = `kubectl logs pod/${config.podName} -n ${config.namespace} --timestamps --container ${config.containerName}`;
    if (!!config?.since) {
        cmd += ` --since ${config.since}`;
    }
    const logs = await execCmd(cmd);
    let jsonLogs = {};

    let logsSplitted = logs.split('\n');
    logsSplitted.pop();
    logsSplitted.shift();

    for (const line of logs.split('\n')) {
        const endDateRange = line.indexOf(' ');
        const timestamp = line.slice(0, endDateRange);
        const log = line.slice(endDateRange + 1, line.length);
        const key = new Date(timestamp).getTime();
        if (key == NaN) {
            console.log(timestamp, line);
        }
        jsonLogs[key] = log;
    }

    process.send(jsonLogs);
    process.disconnect();
});