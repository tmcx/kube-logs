import Fastify, { FastifyInstance } from 'fastify';
import { getLogsRoute } from './routes/logs';
import { getNamespacesRoute } from './routes/namespaces';
import { getPodsRoute } from './routes/pods';
import cors from '@fastify/cors';
import { getActivityRoute } from './routes/activity';


const server: FastifyInstance = Fastify({});
server.register(cors);

server.addHook('preHandler', (req, res, done) => {
    res.type('application/json; charset=utf-8');
    done();
});

server.route(getLogsRoute);
server.route(getNamespacesRoute);
server.route(getPodsRoute);
server.route(getActivityRoute);



const start = async () => {
    try {
        await server.listen({ port: 3000 })
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start();