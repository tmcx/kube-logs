import Fastify, { FastifyInstance } from 'fastify';
import { CMD } from './utils/cmd';


const server: FastifyInstance = Fastify({});

server.get('/ping', async (request, reply) => {
    return { pong: 'it worked!' }
});

server.get('/pods', async (req, res) => {
    res.type('application/json; charset=utf-8');
    try {
        const pods = await CMD.exec('kubectl get pods -A')
        const jsonPods = pods.split('\n').map((line) => {
            const row = line.split(' ').filter((field) => field != ' ' && field != '');
            const jsonRow = {
                namespace: row[0],
                name: row[1],
                containers_count: row[2],
                state: row[3],
                restarts: row[4],
                created_at: row.splice(5, row.length).join(' '),
            }
            return jsonRow;
        });
        res.code(200);
        res.send(jsonPods.splice(0, jsonPods.length - 1));
    } catch (error) {
        res.code(500);
        res.send({ message: error });
    }
});


const start = async () => {
    try {
        await server.listen({ port: 3000 })

        const address = server.server.address()
        const port = typeof address === 'string' ? address : address?.port

    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
start()