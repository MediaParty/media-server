import Client, {Socket} from "socket.io-client";
import {Server} from "socket.io";
import {Server as HttpServer} from "http";
import {expect} from "@jest/globals";

import {startServers} from "../../webSockets";
import {addParticipant, createNewRoom, isRoomAvailable} from "../../../sessions-manager/RoomsManager";
import {isParticipantInARoom} from "../../../sessions-manager/ParticipantManager";

describe("Disconnection handler tests", () => {
    let ioServer: Server, httpServer: HttpServer, clientSocket: Socket;

    beforeEach((done) => {
        const servers = startServers();
        ioServer = servers.io;
        httpServer = servers.httpServer;
        clientSocket = Client("http://localhost:3000", {
            path: "/media-party"
        });
        clientSocket.on("connect", done);
    });

    afterEach(() => {
        ioServer.close();
        httpServer.close();
        clientSocket.disconnect();
    });

    it("Disconnection correctly delete participant and room", (done) => {
        const roomId = createNewRoom("DISCORRDELROM");
        const participantId = clientSocket.id;
        addParticipant(roomId, participantId);
        expect(isRoomAvailable(roomId)).toBeTruthy();
        expect(isParticipantInARoom(participantId)).toBeTruthy();
        clientSocket.on("disconnect", () => {
            setTimeout(() => {
                expect(isRoomAvailable(roomId)).not.toBeTruthy();
                expect(isParticipantInARoom(participantId)).not.toBeTruthy();
                done();
            }, 1000);
        })
        clientSocket.disconnect();
    });

    it("Disconnection correctly delete participant only", (done) => {
        const roomId = createNewRoom("DISCORRDELONLY");
        const participantId = clientSocket.id;
        const participantId2 = "FAKE_PARTICIPANT";
        addParticipant(roomId, participantId);
        addParticipant(roomId, participantId2);
        expect(isRoomAvailable(roomId)).toBeTruthy();
        expect(isParticipantInARoom(participantId)).toBeTruthy();
        expect(isParticipantInARoom(participantId2)).toBeTruthy();
        clientSocket.on("disconnect", () => {
            setTimeout(() => {
                expect(isRoomAvailable(roomId)).toBeTruthy();
                expect(isParticipantInARoom(participantId)).not.toBeTruthy();
                expect(isParticipantInARoom(participantId2)).toBeTruthy();
                done();
            }, 1000);
        })
        clientSocket.disconnect();
    });

    it("Doesn't brake if participant isn't in a room", (done) => {
        const participantId = clientSocket.id;
        expect(isParticipantInARoom(participantId)).not.toBeTruthy();
        clientSocket.on("disconnect", () => {
            setTimeout(() => {
                expect(isParticipantInARoom(participantId)).not.toBeTruthy();
                done();
            }, 1000);
        })
        clientSocket.disconnect();
    })
})