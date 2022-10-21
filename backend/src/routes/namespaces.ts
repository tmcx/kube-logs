import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { getNamespaces } from '../kubectl/get-namespaces';

const getNamespacesRoute: RouteOptions = {
    method: 'GET',
    url: '/namespaces',
    handler: async (req: FastifyRequest, res: FastifyReply) => {
        try {
            const namespaces = await getNamespaces();
            res.code(200);
            res.send(namespaces);
        } catch (error) {
            res.code(500);
            res.send({ message: error });
        }
    },
}


export { getNamespacesRoute };