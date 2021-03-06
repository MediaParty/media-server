import {
    addParticipant,
    createNewRoom,
    destroyRoom,
    isRoomAvailable,
    removeParticipant,
    retrieveRoomData,
    retrieveRoomParticipants
} from "../RoomsManager";
import {uniqueNamesGenerator} from "unique-names-generator";
import {expect} from "@jest/globals";
import {isParticipantInARoom} from "../ParticipantManager";
import {FastifyReply} from "fastify";

jest.mock("unique-names-generator", () => ({
    uniqueNamesGenerator: jest.fn(() => "mockedName")
}))

describe("RoomsManager tests", () => {
    // @ts-ignore
    const fastifyReply: FastifyReply = {};
    it("Create correctly a new room", () => {
        const roomId = createNewRoom("Test room", "");
        const roomNumber = parseInt(roomId);
        expect(roomNumber).toBeGreaterThan(99999);
        expect(roomNumber).toBeLessThanOrEqual(999999);
        expect(roomId.length).toBe(6);
    });

    it("Room doesn't exists", () => {
        const roomAvailable = isRoomAvailable("fakeRoomId");
        expect(roomAvailable).not.toBeTruthy();
    });

    it("Room exists after creation", () => {
        const roomId = createNewRoom("thisRoomNowExists", "");
        expect(isRoomAvailable(roomId)).toBeTruthy();
    });

    it("Participant already in a room", () => {
        const roomId = createNewRoom("participantInRoom", "");
        const participantId = "PIN1";
        expect(isParticipantInARoom(participantId)).not.toBeTruthy();
        expect(addParticipant(roomId, participantId, fastifyReply)).toBeTruthy();
        expect(isParticipantInARoom(participantId)).toBeTruthy();
    });

    it("User doesn't partecipate to a room", () => {
        expect(isParticipantInARoom("456")).not.toBeTruthy()
    });

    it("User isn't added to not existing room", () => {
        const participantId = "NER1";
        expect(addParticipant("123", participantId, fastifyReply)).not.toBeTruthy();
        expect(isParticipantInARoom(participantId)).not.toBeTruthy();
    });

    it("User isn't added if already present", () => {
        const roomId = createNewRoom("USER_ADDED", "");
        const participantId = "NTAP1";
        expect(addParticipant(roomId, participantId, fastifyReply)).toBeTruthy();
        expect(addParticipant(roomId, participantId, fastifyReply)).not.toBeTruthy();
        expect(uniqueNamesGenerator).toHaveBeenCalledTimes(1);
    });

    it("Doesn't remove from not existing room", () => {
        expect(removeParticipant("UNE1")).not.toBeTruthy();
    });

    it("Doesn't remove if isn't in room", () => {
        expect(removeParticipant("DNRIR1")).not.toBeTruthy();
    })

    it("Remove correctly user", () => {
        const roomId = createNewRoom("USER_REMOVED_OK", "");
        const participantId1 = "URO1";
        const participantId2 = "URO2";
        expect(addParticipant(roomId, participantId1, fastifyReply)).toBeTruthy();
        expect(addParticipant(roomId, participantId2, fastifyReply)).toBeTruthy();
        expect(isParticipantInARoom(participantId1)).toBeTruthy();
        expect(isParticipantInARoom(participantId2)).toBeTruthy();
        expect(removeParticipant(participantId1)).toBeTruthy();
        expect(isParticipantInARoom(participantId2)).toBeTruthy();
    });

    it("Retrieve participants", () => {
        const roomId = createNewRoom("PARTICIPANTS", "");
        const participantId = "PARTICIPANT_1";
        expect(addParticipant(roomId, participantId, fastifyReply)).toBeTruthy();
        expect(isParticipantInARoom(participantId)).toBeTruthy();
        expect(retrieveRoomParticipants(roomId)[0]?.id).toBe(participantId);
    });

    it("Retrieve empty participants list", () => {
        expect(retrieveRoomParticipants("RETRIEVE_EMTPY_LIST")).toStrictEqual([]);
    });

    it("Destroy not existing room", () => {
        expect(destroyRoom("DEST_NOT_EXT_ROOM")).not.toBeTruthy();
    });

    it("Correctly destroy a room", () => {
        const roomId = createNewRoom("DESTROY_CREATED_ROOM", "");
        expect(isRoomAvailable(roomId)).toBeTruthy();
        expect(destroyRoom(roomId)).toBeTruthy();
        expect(isRoomAvailable(roomId)).not.toBeTruthy();
    });

    it("Return undefined room data", () => {
        expect(retrieveRoomData("UNDEF_ROOM_DATA")).not.toBeTruthy();
    });

    it("Return room data for definied room", () => {
        const roomId = createNewRoom("DEF_ROOM_DATA", "");
        expect(retrieveRoomData(roomId)).toBeTruthy();
    })
});