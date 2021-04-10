import {createServer, Server as HttpServer} from "http";
import {Server, Socket} from "socket.io";
import {disconnectionHandlerBuilder} from "./handlers/disconnectionHandler";

export const startServers = () => {
    const {io, httpServer} = createServers();
    setConnectionHandler(io);
    startHttpServer(httpServer);
    return {io, httpServer}
}

const createServers = () => {
    const httpServer = createServer({});
    const io = new Server(httpServer, {
        path: "/media-party"
    });
    return {io, httpServer};
}

const setConnectionHandler = (io: Server) => {
    io.on("connection", connectionHandlers)
}

const connectionHandlers = (socket: Socket) => {
    socket.on("disconnect", disconnectionHandlerBuilder(socket));
}

const startHttpServer = (httpServer: HttpServer) => {
    httpServer.listen(process.env["PORT"] || 3000)
}