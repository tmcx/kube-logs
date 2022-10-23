import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { getPodLogs } from '../kubectl/get-pod-logs';
import { getPods } from '../kubectl/get-pods';

const getActivityRoute: RouteOptions = {
    method: 'GET',
    url: '/activity',
    handler: async (req: FastifyRequest, res: FastifyReply) => {
        try {

            const since = (req.query as any).since || '1m';
            const pods = await getPods();
            const activePodsLogs = [];
            const total = pods.length;
            console.log('Total pods: ',total);
            let i = 1;
            for (const pod of pods) {
                const podLogs = await getPodLogs(pod.name, pod.namespace, since);
                activePodsLogs.push(podLogs);
                console.log(i, 'of', total);
                i++;
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