import {
    addParticipantToRoom,
    createInitialParticipantData,
    isParticipantInARoom,
    removeParticipant,
    retrieveParticipantRoom
} from "../ParticipantManager";
import {expect} from "@jest/globals";

describe("ParticipantManager tests", () => {
    it("Undefined room for not participant user", () => {
        expect(retrieveParticipantRoom("NOT_EXISTING_PARTICIPANT")).toBeUndefined()
    });

    it("Correct room id for participant", () => {
        const roomId = "CORRECT_ROOM_ID";
        const participantId = "CORRECT_ID_FOR_PARTICIPANT";
        addParticipantToRoom(participantId, roomId);
        expect(retrieveParticipantRoom(participantId)).toBe(roomId);
    });

    it("Correctly create participant data", () => {
        const participantId = "PARTICIPANT_ID_DATA";
        const participantData = createInitialParticipantData(participantId);
        expect(participantData.id).toBe(participantId);
        expect(participantData.name).not.toBeUndefined();
        expect(participantData.stream).toBeUndefined();
    });

    it("Participant is not in a room", () => {
        expect(isParticipantInARoom("PARTICIPANT_NOT_IN_ROOM")).toBeFalsy();
    });

    it("Participant is in a room", () => {
        const participantId = "PARTICIPANT_IN_ROOM";
        addParticipantToRoom(participantId, "ROOM_ID");
        expect(isParticipantInARoom(participantId)).toBeTruthy();
    });

    it("Delete participant doesn't brake if doesn't exist", () => {
        expect(removeParticipant("DELETE_INEXISTENT_PARTICIPANT")).toBeFalsy();
    })

    it("Delete participant correctly", () => {
        const participantId = "DELETE_PARTICIPANT_ID";
        addParticipantToRoom(participantId, "ROOM_ID");
        expect(removeParticipant(participantId)).toBeTruthy();
    });
})