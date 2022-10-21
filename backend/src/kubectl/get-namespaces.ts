import { CMD } from '../utils/cmd';

interface Namespace {
    namespace: string;
    status: string;
    age: string;
}

export async function getNamespaces(): Promise<Namespace[]> {
    try {
        const cmd = `kubectl get namespaces`;
        const namespaces = await CMD.exec(cmd);
        const jsonNamespaces = namespaces.split('\n').map((line) => {
            const row = line.split(' ').filter((field) => field != ' ' && field != '');
            const jsonRow = {
                namespace: row[0],
                status: row[1],
                age: row[row.length - 1],
            }
            return jsonRow;
        });
        jsonNamespaces.pop();
        jsonNamespaces.shift();
        return jsonNamespaces;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
