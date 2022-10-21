import { FastifyReply, FastifyRequest } from "fastify";
import { CMD } from "../utils/cmd";

async function getPods(req: FastifyRequest, res: FastifyReply) {
    const pods = await CMD.exec('kubectl get pods -A');

    return pods.split('\n').map((line) => {
        const row = line.split(' ').filter((field) => field != ' ' && field != '');
        console.log(row);
        return {
            namespace: row[0],
            name: row[1],
            containers_count: row[2],
            state: row[3],
            restarts: row[4],
            created_at: row[5]
        }
    });
}


export {
    getPods
};