import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { getPodLogs, Logs } from '../kubectl/get-pod-logs';
import { getPods, Pod } from '../kubectl/get-pods';
import { groupByN } from '../utils/group';

const getActivityRoute: RouteOptions = {
    method: 'GET',
    url: '/activity',
    handler: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const since = Number((req.query as any).since) || 1;
            const sinceTime = new Date(new Date().getTime() - (since * 1000)).toISOString();

            const groupBy = Number((req.query as any).group_by) || 10;
            const pods = await getPods();
            const activePodsLogs: { [key: string]: Logs } = {};
            const totalPods = pods.length;
            console.log('Total pods: ', totalPods);
            let i = 1;

            const groupOfPods = groupByN<Pod>(groupBy, pods);

            for (const group of groupOfPods) {
                const promises = group.map((pod) =>
                    new Promise<void>(async (resolve, reject) => {
                        const podLogs = await getPodLogs(pod, pod.namespace, sinceTime);
                        if (Object.keys(podLogs).length > 0) {
                            activePodsLogs[pod.name] = podLogs;
                        }
                        resolve();
                        i++;
                    }));
                await Promise.all(promises);
                console.log(i, 'of', totalPods);
            }
            console.log(activePodsLogs);
            res.code(200);
            res.send(activePodsLogs);
        } catch (error) {
            res.code(500);
            res.send({ message: error });
        }
    },
}


export { getActivityRoute };