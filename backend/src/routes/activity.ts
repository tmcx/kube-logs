import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { getPodLogs, Logs } from '../kubectl/get-pod-logs';
import { getPods, Pod } from '../kubectl/get-pods';
import { groupByN } from '../utils/group';

const getActivityRoute: RouteOptions = {
    method: 'GET',
    url: '/activity',
    handler: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const since = Number((req.query as any).min_since) || 1;
            const namespace = (req.query as any).specific_namespace || undefined;
            const ignoreNamespace = (req.query as any)?.ignore_namespace?.split(',') || undefined;


            const sinceTime = new Date((new Date().getTime() - (since * 60 * 1000))).toISOString();
            const nowTime = new Date().toISOString();
            const groupBy = Number((req.query as any).group_by) || 10;

            let pods = await getPods(namespace);
            const activePodsLogs: { [key: string]: Logs } = {};
            pods = pods.filter((pod) => !ignoreNamespace.includes(pod.name));
            const totalPods = pods.length;

            console.log('Specific namespace:', (namespace) ? namespace : 'None');
            console.log('Ignore namespaces:', (ignoreNamespace.length > 0) ? ignoreNamespace : 'None');
            console.log('From', sinceTime, (req.query as any).min_since, 'min');
            console.log('Until', nowTime);
            console.log('Total pods: ', totalPods);


            let i = 1;
            const groupOfPods = groupByN<Pod>(groupBy, pods);

            for (const group of groupOfPods) {
                const promises = group.map((pod) =>
                    new Promise<void>(async (resolve, reject) => {
                        console.log(pod.name);
                        const podLogs = await getPodLogs(pod, pod.namespace, sinceTime, nowTime);
                        if (Object.keys(podLogs).length > 0) {
                            activePodsLogs[pod.name] = podLogs;
                        }
                        resolve();
                        i++;
                    }));
                await Promise.all(promises);
                console.log(i, 'of', totalPods);
            }
            console.log(Object.keys(activePodsLogs).length);
            res.code(200);
            res.send(activePodsLogs);
        } catch (error) {
            res.code(500);
            res.send({ message: error });
        }
    },
}


export { getActivityRoute };