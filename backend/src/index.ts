import Fastify, { FastifyInstance } from 'fastify';
import { getPodLogsHandler } from './handlers/getPodLogs';
import { getPodsHandler } from './handlers/getPods';


const server: FastifyInstance = Fastify({});

server.get('/ping', async (req, res) => ({ pong: 'it worked!' }));


server.get('/pods', async (req, res) => await getPodsHandler(req, res));

server.get('/pods/:pod_name/logs', async (req, res) => await getPodLogsHandler(req, res));






const start = async () => {
    try {
        await server.listen({ port: 3000 })
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start();