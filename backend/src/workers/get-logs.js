const execCmd = require('./exec');

process.on('message', async function (config) {

    let cmd = `kubectl logs pod/${config.podName} -n ${config.namespace} --timestamps --container ${config.containerName}`;
    if (!!config?.since) {
        cmd += ` --since-time ${config.since}`;
    }
    if (!!config?.until) {
        cmd += ` | awk '$0 < "${config.until}"'`;
    }
    let haveContent = false;
    let jsonLogs = {};

    try {        
    const logs = await execCmd(cmd);

    let logsSplitted = logs.split('\n');
    logsSplitted.pop();
    logsSplitted.shift();


    for (const line of logs.split('\n')) {
        const endDateRange = line.indexOf(' ');
        const timestamp = line.slice(0, endDateRange);
        const log = line.slice(endDateRange + 1, line.length);
        const key = new Date(timestamp).getTime();
        if (!Number.isNaN(key)) {
            jsonLogs[key] = log;
            if (!haveContent) {
                haveContent = true;
            }
        }
    }

    } catch (error) {
        console.log(config.podName, error);
    }

    process.send(haveContent ? jsonLogs : {});
    process.disconnect();
});