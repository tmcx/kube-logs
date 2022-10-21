import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';
import { getPods } from '../kubectl/get-pods';

const getPodsRoute: RouteOptions = {
  method: 'GET',
  url: '/pods',
  handler: async (req: FastifyRequest, res: FastifyReply) => {
    try {
      let namespace = (req.query as any).namespace;

      const pods = await getPods(namespace);

      res.code(200);
      res.send(pods);
    } catch (error) {
      res.code(500);
      res.send({ message: error });
    }
  },
}


export { getPodsRoute };



