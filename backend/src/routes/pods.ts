import { FastifyReply, FastifyRequest } from "fastify";
import { CMD } from "../utils/cmd";

async function getPods(req: FastifyRequest, res: FastifyReply) {
    res.header("Content-Type", "application/json; charset=utf-8");

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
        return jsonPods.splice(0, jsonPods.length - 1);
    } catch (error) {
        res.code(500);
        return { message: error };
    }
}


export {
    getPods
};