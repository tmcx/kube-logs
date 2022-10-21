import { FastifyReply, FastifyRequest } from "fastify";
import { getNamespaces } from "../kubectl/getNamespaces";

export async function getNamespacesHandler(req: FastifyRequest, res: FastifyReply) {
    console.log('getNamespacesHandler');
    res.type('application/json; charset=utf-8');
    try {
        const namespaces = await getNamespaces();
        res.code(200);
        res.send(namespaces);
    } catch (error) {
        res.code(500);
        res.send({ message: error });
    }
}
