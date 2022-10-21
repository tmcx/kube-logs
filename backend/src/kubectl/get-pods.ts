import { CMD } from '../utils/cmd';
import { getPodContainers } from './get-pod-containers';

interface Pod {
    namespace: string;
    name: string;
    containers: {
        names: string[];
        count: string;
    }
    status: string;
    restarts: string;
    age: string;
}

export async function getPods(namespace?: string): Promise<Pod[]> {
    try {
        let cmd = `kubectl get pods ${(!!namespace) ? '-n ' + namespace : '-A'}`;
        console.log(cmd);
        const pods = await CMD.exec(cmd);

        const jsonPods = [];
        const lines = pods.split('\n');
        lines.pop();
        lines.shift();

        for (const line of lines) {
            const row = line.split(' ').filter((field) => field != ' ' && field != '');
            const containers = await getPodContainers(row[1]);
            const jsonRow = {
                namespace: row[0],
                name: row[1],
                containers: {
                    names: containers,
                    count: row[2]
                },
                status: row[3],
                restarts: row.slice(4, row.length - 1).join(' '),
                age: row[row.length - 1],
            }
            jsonPods.push(jsonRow);
        }
        return jsonPods;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
