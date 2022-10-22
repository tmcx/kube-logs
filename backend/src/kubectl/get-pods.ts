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
            const containers = await pod.status.containerStatuses
                .map((containerStatus: any) => {

                    const status = Object.keys(containerStatus.state)[0];
                    return {
                        restarts_count: containerStatus.restartCount,
                        started_at: containerStatus.state[status].startedAt,
                        name: containerStatus.name,
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
