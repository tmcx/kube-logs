import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { getPodLogs, Logs } from '../kubectl/get-pod-logs';
import { getPods } from '../kubectl/get-pods';
import { groupByN } from '../utils/group';

const getActivityRoute: RouteOptions = {
    method: 'GET',
    url: '/activity',
    handler: async (req: FastifyRequest, res: FastifyReply) => {
        try {

            const since = (req.query as any).since || '1m';
            const pods = await getPods();
            const activePodsLogs: Logs[] = [];
            const totalPods = pods.length;
            console.log('Total pods: ', totalPods);
            let i = 1;

            const groupOfPods = groupByN(10, pods);

            for (const group of groupOfPods) {
                const promises = group.map((pod) => {
                    new Promise<void>(async (resolve, reject) => {
                        const podLogs = await getPodLogs(pod, pod.namespace, since);
                        activePodsLogs.push(podLogs);
                        i++;
                    })
                });
                await Promise.all(promises);
                console.log(i, 'of', totalPods);
            }

            res.code(200);
            res.send(activePodsLogs);
        } catch (error) {
            res.code(500);
            res.send({ message: error });
        }
    },
}


export { getActivityRoute };