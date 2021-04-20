import {Socket} from "socket.io";
import {FastifyInstance} from "fastify";

import {disconnectionHandlerBuilder} from "./handlers/disconnectionHandler";
import {seekHandler} from "./handlers/seekHandler";

export const addSocketIoHandlers = (fastifyInstance: FastifyInstance) => {
    // @ts-ignore
    fastifyInstance.io.on("connection", connectionHandlers)
}

const connectionHandlers = (socket: Socket) => {
    socket.on("disconnect", disconnectionHandlerBuilder(socket));
    socket.on("seek", seekHandler(socket));
}