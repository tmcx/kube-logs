import { CMD } from '../utils/cmd';
import { getPodNamespace } from './get-pod-namespace';

export async function getPodContainers(podName: string): Promise<string[]> {
    try {
        const namespace = await getPodNamespace(podName);

        let cmd = `kubectl get pod/${podName} -o jsonpath='{.spec.containers[*].name}' -n ${namespace}`
        const containers = await CMD.exec(cmd);

        return containers.split(' ');
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
