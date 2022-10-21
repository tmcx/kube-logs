import { CMD } from "../utils/cmd";

interface Log {
    log: string;
    timestamp: string;
}

export async function getPodLogs(podName: string, namespace: string): Promise<Log[]> {
    try {
        const cmd = `kubectl logs pod/${podName} -n ${namespace} --timestamps --all-containers`;
        const logs = await CMD.exec(cmd);
        const jsonlogs = logs.split('\n').map((line) => {
            const endDateRange = line.indexOf(' ');
            const timestamp = line.slice(0, endDateRange);
            const log = line.slice(endDateRange + 1, line.length);;
            return {
                timestamp,
                log
            }
        });
        jsonlogs.pop();
        jsonlogs.shift();
        return jsonlogs;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
