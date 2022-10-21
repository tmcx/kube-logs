import { CMD } from "../utils/cmd";

interface Pod {
    namespace: string;
    name: string;
    containers_count: string;
    status: string;
    restarts: string;
    age: string;
}

export async function getPods(): Promise<Pod[]> {
    try {
        const cmd = 'kubectl get pods -A';
        const pods = await CMD.exec(cmd);
        const jsonPods = pods.split('\n').map((line) => {
            const row = line.split(' ').filter((field) => field != ' ' && field != '');
            const jsonRow = {
                namespace: row[0],
                name: row[1],
                containers_count: row[2],
                status: row[3],
                restarts: row.slice(4, row.length - 2).join(' '),
                age: row[row.length - 1],
            }
            return jsonRow;
        });
        jsonPods.pop();
        jsonPods.shift();
        return jsonPods;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
