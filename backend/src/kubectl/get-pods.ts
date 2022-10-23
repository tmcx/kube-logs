import { mockPodsRaw } from '../mock/pods.raw';
import { CMD } from '../utils/cmd';

interface Pod {
    namespace: string;
    name: string;
    containers: {
        restarts_count: string;
        started_at: string;
        status: string;
        name: string;
    }[]
}

export async function getPods(namespace?: string): Promise<Pod[]> {
    try {
        let cmd = `kubectl get pods ${(!!namespace) ? '-n ' + namespace : '-A'} -o json`;
        console.log(cmd);
        const podsRaw = JSON.parse(await CMD.exec(cmd));

        const jsonPods = [];



        for (const pod of podsRaw.items) {
            console.log(pod.metadata.name);
            console.log(pod.status);
            const containers = pod.spec.containers
                .map((container:any) => {
                    const containerStatus = pod
                        .status
                        ?.containerStatuses
                        ?.find((containerStatus:any) => containerStatus.name == container.name);

                    let status = 'unknown';
                    let started_at = 'unknown';
                    let restarts_count = 'unknown';
                    if (containerStatus) {
                        status = Object.keys(containerStatus.state)[0];
                        started_at = containerStatus.state[status].startedAt;
                        restarts_count = containerStatus.restartCount;
                    }
                    return {
                        name: container.name,
                        restarts_count,
                        started_at,
                        status
                    }
                });
            const jsonRow = {
                namespace: pod.metadata.namespace,
                name: pod.metadata.name,
                containers
            }
            jsonPods.push(jsonRow);
        }
        return jsonPods;
    } catch (error: any) {
        console.error(error);
        throw new Error(error);
    }
}
