import {startServers} from "./webSockets";
import {expect} from "@jest/globals";

describe("WebSockets test", () => {
    it("Start server correctly", () => {
        const servers = startServers();
        expect(servers.io.path()).toBe('/media-party');
        expect(servers.httpServer.listening).toBeTruthy();
        servers.io.close();
        servers.httpServer.close();
    });
})