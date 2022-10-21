import { CMD } from "../utils/cmd";

interface Pod {
    namespace: string;
    name: string;
    containers_count: string;
    state: string;
    restarts: string;
    created_at: string;
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
                state: row[3],
                restarts: row.slice(4, row.length - 2).join(' '),
                created_at: row[row.length - 1],
            }
            return jsonRow;
        });
        return jsonPods.slice(0, jsonPods.length - 1);
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
