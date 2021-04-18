import fastify, {FastifyInstance} from "fastify";
import fastifySocketIo from "fastify-socket.io";
import {IncomingMessage, Server, ServerResponse} from "http";
import {mediaPartyLogger} from "./logger";
import {addSocketIoHandlers} from "./sockets/configureHandlers";
import {getMedia} from "./http/getMedia";

export const fastifyLauncher = async () => {
    const fastifyInstance: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({logger: true});

    fastifyInstance.register(fastifySocketIo, {
        path: "/media-party"
    });

    fastifyInstance.register(getMedia)

    await fastifyInstance.listen(process.env["PORT"] || 3000, () => {
        addSocketIoHandlers(fastifyInstance);
        mediaPartyLogger.info("Server has been started");
    });
    return fastifyInstance;
}

if (!process.env["TEST"])
    fastifyLauncher()