import { getPodContainers } from './get-pod-containers';
import { Pod } from './get-pods';
import { fork } from 'child_process';

type Log = { [key: number]: string }
export type Logs = { [key: string]: Log };

export async function getPodLogs(pod: Pod | string, namespace: string, since: string = ''): Promise<Logs | null> {
    try {
        let containers = [];
        let podName = '';

        if (typeof pod == 'string') {
            containers = await getPodContainers(pod);
            podName = pod;
        } else {
            containers = pod.containers.map((container) => container.name);
            podName = pod.name;
        }

        let haveLogs = false;

        const jsonlogs: Logs = {};
        for (const containerName of containers) {
            let child = fork(__dirname + '/../workers/get-logs.js');
            const logs = await new Promise<Log>((resolve, reject) => {
                child.on('message', function (message: any) {
                    resolve(message);
                });
                child.send({ podName, namespace, containerName, since });

            })
            if (logs != null && !haveLogs) {
                haveLogs = true;
            }
            jsonlogs[containerName] = logs;
        }

        return haveLogs ? jsonlogs : null;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
