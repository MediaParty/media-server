import Client, {Socket} from "socket.io-client";
import {FastifyInstance, FastifyReply} from "fastify";

import {addParticipant, createNewRoom, retrieveRoomData} from "../../../sessions-manager/RoomsManager";
import {fastifyLauncher} from "../../../main";
import {Decoder} from "../../../decoders/Decoder";

describe("Seek handler tests", () => {
    let fastifyInstance: FastifyInstance, clientSocket: Socket;
    // @ts-ignore
    const fakeReply: FastifyReply = {};

    let testDecoder: Decoder;

    beforeAll(async () => {
        fastifyInstance = await fastifyLauncher();
    });

    beforeEach((done) => {
        clientSocket = Client("http://localhost:3000", {
            path: "/media-party"
        });
        clientSocket.on("connect", done);
        testDecoder = {
            start: jest.fn(),
            stop: jest.fn(),
            seek: jest.fn((_: number) => true),
            getStream: jest.fn()
        }
    });

    afterEach(() => {
        clientSocket.disconnect();
    });

    afterAll(async () => {
        await fastifyInstance.close();
    });

    const mockNewRoom = (roomName: string) => {
        const roomId = createNewRoom(roomName, "");
        // @ts-ignore
        retrieveRoomData(roomId).decoder = testDecoder
        const participantId = clientSocket.id;
        addParticipant(roomId, participantId, fakeReply);
    }

    it("Correctly seek for a valid room", (done) => {
        mockNewRoom("SEEK_VALID_ROOM");
        clientSocket.emit("seek", {seekTime: 10});
        setTimeout(() => {
            expect(testDecoder.seek).toHaveBeenCalledWith(10);
            done();
        }, 1000);
    });

    it("Ok even with negative seek time", (done) => {
        mockNewRoom("SEEK_VALID_ROOM_NEGATIVE");
        clientSocket.emit("seek", {seekTime: -10});
        setTimeout(() => {
            expect(testDecoder.seek).not.toHaveBeenCalled();
            done();
        }, 1000);
    });

    it("Don't seek for invalid room", (done) => {
        clientSocket.emit("seek", {seekTime: 15});
        setTimeout(() => {
            expect(testDecoder.seek).not.toHaveBeenCalled();
            done();
        }, 1000);
    })
})