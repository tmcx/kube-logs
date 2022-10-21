import { FastifyReply, FastifyRequest } from "fastify";
import { getPodLogs } from "../kubectl/getPodLogs";
import { getPods } from "../kubectl/getPods";

export async function getPodsLogsHandler(req: FastifyRequest, res: FastifyReply) {
    console.log('getPodsLogsHandler');
    res.type('application/json; charset=utf-8');
    try {
        const pods = await getPods();
        const podLogs = [];
        for (const pod of pods) {
            podLogs.push(await getPodLogs(pod.name, pod.namespace));
        }
        res.code(200);
        res.send(podLogs);
    } catch (error) {
        res.code(500);
        res.send({ message: error });
    }
}
