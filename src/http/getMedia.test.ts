import {FastifyInstance} from "fastify";

import {fastifyLauncher} from "../main";
import {isParticipantInARoom} from "../sessions-manager/ParticipantManager";
import {createNewRoom} from "../sessions-manager/RoomsManager";

describe("Get media tests", () => {
    let fastifyInstance: FastifyInstance

    beforeAll(async () => {
        fastifyInstance = await fastifyLauncher();
    });

    afterAll(async () => {
        await fastifyInstance.close();
    });

    it("Doesn't add user with invalid party id", (done) => {
        const participantId = 'noParticipantId';
        fastifyInstance.inject({
            path: `/room/noRoomId/participant/${participantId}`
        });
        setTimeout(() => {
            expect(isParticipantInARoom(participantId)).not.toBeTruthy();
            done()
        });
    });

    it("Correctly add user", (done) => {
        const roomId = createNewRoom("CORRCRADDUSR", "");
        const participantId = 'CORRCRADDUSRPAR';
        fastifyInstance.inject({
            path: `/room/${roomId}/participant/${participantId}`
        });
        setTimeout(() => {
            expect(isParticipantInARoom(participantId)).toBeTruthy();
            done();
        });
    });
})