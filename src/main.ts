import fastify, {FastifyInstance} from "fastify";
import fastifySocketIo from "fastify-socket.io";
import {IncomingMessage, Server, ServerResponse} from "http";
import {mediaPartyLogger} from "./logger";
import {addSocketIoHandlers} from "./sockets/configureHandlers";

let fastifyInstance: FastifyInstance<Server, IncomingMessage, ServerResponse>

export const fastifyLauncher = async () => {
    if (!fastifyInstance) {
        fastifyInstance = fastify({logger: true});

        fastifyInstance.register(fastifySocketIo, {
            path: "/media-party"
        });

        await fastifyInstance.listen(process.env["PORT"] || 3000, () => {
            addSocketIoHandlers(fastifyInstance);
            mediaPartyLogger.info("Server has been started");
        });
    }
    return fastifyInstance;
}

fastifyLauncher();