import {startServers} from "./websocket/webSockets";

const {httpServer} = startServers()

httpServer.addListener("request", (request, response) => {
    console.log(request, response);
})