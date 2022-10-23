import { CMD } from '../utils/cmd';
import { getPodContainers } from './get-pod-containers';
import { Pod } from './get-pods';

type Logs = { [key: string]: { [key: number]: string } };

export async function getPodLogs(pod: Pod | string, namespace: string, since: string = ''): Promise<Logs> {
    try {
        const containers = (typeof pod == 'string') ? await getPodContainers(pod) : pod.containers.map((container) => container.name);
        const jsonlogs: Logs = {};
        for (const containerName of containers) {

            let cmd = `kubectl logs pod/${pod} -n ${namespace} --timestamps --container ${containerName}`;
            if (!!since) {
                cmd += ` --since ${since}`;
            }

            const logs = await CMD.exec(cmd);
            jsonlogs[containerName] = {};

            let logsSplitted = logs.split('\n');
            logsSplitted.pop();
            logsSplitted.shift();

            for (const line of logs.split('\n')) {
                const endDateRange = line.indexOf(' ');
                const timestamp = line.slice(0, endDateRange);
                const log = line.slice(endDateRange + 1, line.length);
                const key = new Date(timestamp).getTime();
                jsonlogs[containerName][key] = log;
            }
        }
        return jsonlogs;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
