import { FastifyReply, FastifyRequest } from "fastify";
import { getPods } from "../kubectl/getPods";

export async function getPodsHandler(req: FastifyRequest, res: FastifyReply) {
    console.log('getPodsHandler');
    res.type('application/json; charset=utf-8');
    try {
        const pods = await getPods();
        res.code(200);
        res.send(pods);
    } catch (error) {
        res.code(500);
        res.send({ message: error });
    }
}
