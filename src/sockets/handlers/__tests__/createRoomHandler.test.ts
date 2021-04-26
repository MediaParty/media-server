import Client, {Socket} from "socket.io-client";
import {FastifyInstance} from "fastify";
import {fastifyLauncher} from "../../../main";
import path from "path";

describe("Create room handler tests", () => {
    let fastifyInstance: FastifyInstance, clientSocket: Socket;

    beforeAll(() => {
        fastifyInstance = fastifyLauncher();
    });

    beforeEach((done) => {
        clientSocket = Client("http://localhost:3000", {
            path: "/media-party"
        });
        clientSocket.on("connect", done);
    });

    afterEach(() => {
        clientSocket.disconnect();
    });

    afterAll(async () => {
        await fastifyInstance.close();
    });

    it("Correctly seek for a valid room", (done) => {
        clientSocket.emit("createRoom", {
            roomName: 'CREATED_ROOM',
            mediaLink: path.join(__dirname, '..', '..', '..', 'decoders', '__tests__', 'test_jellyfish.mkv')
        });
        clientSocket.on("roomCreated", ({roomId}) => {
            expect(roomId).toBeTruthy()
            done();
        });
    });
})