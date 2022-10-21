import { FastifyReply, FastifyRequest } from "fastify";
import { getPodLogs } from "../kubectl/getPodLogs";
import { getPods } from "../kubectl/getPods";

export async function getPodsLogsHandler(req: FastifyRequest, res: FastifyReply) {
    console.log('getPodsLogsHandler');
    res.type('application/json; charset=utf-8');
    try {
        const podLogs = [];
        const namespace = (req.params as any).namespace
        if (!!namespace) {
            const pods = await getPods();
            for (const pod of pods) {
                if (pod.namespace == namespace) {
                    podLogs.push(await getPodLogs(pod.name, pod.namespace));
                }
            }
        }
        res.code(200);
        res.send(podLogs);
    } catch (error) {
        res.code(500);
        res.send({ message: error });
    }
}
