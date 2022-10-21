import { FastifyReply, FastifyRequest } from "fastify";
import { getPodLogs } from "../kubectl/getPodLogs";
import { getPodNamespace } from "../kubectl/getPodNamespace";

export async function getPodLogsHandler(req: FastifyRequest, res: FastifyReply) {
    console.log('getPodLogsHandler');
    res.type('application/json; charset=utf-8');
    try {
        const podName = (req.params as any).pod_name;
        const namespace = await getPodNamespace(podName);
        console.log(podName, namespace);
        if (!namespace) {
            res.code(404);
            res.send({ message: `Not exists pod: ${podName}` });
            return;
        }

        const logs = await getPodLogs(podName, namespace);
        res.code(200);
        res.send(logs);
    } catch (error) {
        res.code(500);
        res.send({ message: error });
    }
}
