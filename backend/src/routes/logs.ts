import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { getPodLogs } from '../kubectl/get-pod-logs';
import { getPodNamespace } from '../kubectl/get-pod-namespace';

const getLogsRoute: RouteOptions = {
    method: 'GET',
    url: '/logs',
    handler: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const podName = (req.query as any).pod_name;
            let namespace = (req.query as any).namespace;
            let since = (req.query as any).since;

            if (!!podName) {
                namespace = (!!podName && !namespace) ? await getPodNamespace(podName) : namespace;
            }

            const logs = await getPodLogs(podName, namespace, since);
            res.code(200);
            res.send(logs);
        } catch (error) {
            res.code(500);
            res.send({ message: error });
        }
    },
}


export { getLogsRoute };