import fastify, {FastifyInstance} from "fastify";
import {IncomingMessage, Server, ServerResponse} from "http";
import {Server as SocketServer} from "socket.io";

import {mediaPartyLogger} from "./logger";
import {addSocketIoHandlers} from "./sockets/configureHandlers";
import {getMedia} from "./http/getMedia";

export const fastifyLauncher = () => {
    const fastifyInstance: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({logger: true});

    fastifyInstance.decorate('io', new SocketServer(fastifyInstance.server, {
        path: "/media-party"
    }));

    fastifyInstance.addHook('onClose', (fastifyInstance, done) => {
        // @ts-ignore
        fastifyInstance.io.close()
        done()
    });

    fastifyInstance.register(getMedia)

    fastifyInstance.listen(process.env["PORT"] || 3000, () => {
        addSocketIoHandlers(fastifyInstance);
        mediaPartyLogger.info("Server has been started");
    });
    return fastifyInstance;
}

if (process.env["PRODUCTION"])
    fastifyLauncher()