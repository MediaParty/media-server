import {Socket} from "socket.io";
import {FastifyInstance} from "fastify";

import {disconnectionHandlerBuilder} from "./handlers/disconnectionHandler";
import {seekHandlerBuilder} from "./handlers/seekHandler";
import {createRoomHandlerBuilder} from "./handlers/createRoomHandler";

export const addSocketIoHandlers = (fastifyInstance: FastifyInstance) => {
    // @ts-ignore
    fastifyInstance.io.on("connection", connectionHandlers)
}

const connectionHandlers = (socket: Socket) => {
    socket.on("disconnect", disconnectionHandlerBuilder(socket));
    socket.on("createRoom", createRoomHandlerBuilder(socket));
    socket.on("seek", seekHandlerBuilder(socket));
}