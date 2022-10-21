import { FastifyReply, FastifyRequest } from "fastify";
import { getPods } from "../kubectl/getPods";

export async function getNamespacesPodsHandler(req: FastifyRequest, res: FastifyReply) {
    console.log('getPodLogsHandler');
    res.type('application/json; charset=utf-8');
    try {
        const namespace = (req.params as any).namespace;
        if (!namespace) {
            res.code(400);
            res.send({ message: `namespace parameter must be defined` });
            return;
        }

        const pods = await getPods(namespace);
        res.code(200);
        res.send(pods);
    } catch (error) {
        res.code(500);
        res.send({ message: error });
    }
}
