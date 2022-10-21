import { CMD } from '../utils/cmd';

export async function getPodNamespace(podName: string): Promise<string | undefined> {
    try {
        let cmd = `kubectl get pods -A | grep ${podName}`;
        const pod = await CMD.exec(cmd);
        return pod.split(' ')[0];
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
