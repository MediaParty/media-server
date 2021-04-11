import {Server, Socket} from "socket.io";
import {FastifyInstance} from "fastify";

import {disconnectionHandlerBuilder} from "./handlers/disconnectionHandler";

export const addSocketIoHandlers = (fastifyInstance: FastifyInstance) => {
    setConnectionHandler(fastifyInstance.io);
}

const setConnectionHandler = (io: Server) => {
    io.on("connection", connectionHandlers)
}

const connectionHandlers = (socket: Socket) => {
    socket.on("disconnect", disconnectionHandlerBuilder(socket));
}