import { FastifyReply, FastifyRequest } from "fastify";
import { CMD } from "../utils/cmd";

async function getPods(req: FastifyRequest, res: FastifyReply) {
    CMD.exec('kubectl get pods -A');
}


export {
    getPods
};