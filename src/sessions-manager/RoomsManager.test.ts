import {
    addUser,
    createNewRoom,
    isParticipantInARoom,
    isRoomAvailable,
    removeUser,
    retrieveRoomParticipants
} from "./RoomsManager";
import {uniqueNamesGenerator} from "unique-names-generator";
import {expect} from "@jest/globals";

jest.mock("unique-names-generator", () => ({
    uniqueNamesGenerator: jest.fn(() => "mockedName")
}))

describe("RoomsManager tests", () => {
    it("Create correctly a new room", () => {
        const roomId = createNewRoom('Test room');
        const roomNumber = parseInt(roomId);
        expect(roomNumber).toBeGreaterThan(99999);
        expect(roomNumber).toBeLessThanOrEqual(999999);
        expect(roomId.length).toBe(6);
    });

    it("Room doesn't exists", () => {
        const roomAvailable = isRoomAvailable('fakeRoomId');
        expect(roomAvailable).not.toBeTruthy();
    });

    it("Room exists after creation", () => {
        const roomId = createNewRoom('thisRoomNowExists');
        expect(isRoomAvailable(roomId)).toBeTruthy();
    });

    it("Participant already in a room", () => {
        const roomId = createNewRoom('participantInRoom');
        const userId = "PIN1";
        expect(isParticipantInARoom(userId)).not.toBeTruthy();
        expect(addUser(roomId, userId)).toBeTruthy();
        expect(isParticipantInARoom(userId)).toBeTruthy();
    });

    it("User doesn't partecipate to a room", () => {
        expect(isParticipantInARoom("456")).not.toBeTruthy()
    });

    it("User isn't added to not existing room", () => {
        const userId = "NER1";
        expect(addUser("123", userId)).not.toBeTruthy();
        expect(isParticipantInARoom(userId)).not.toBeTruthy();
    });

    it("User isn't added if already present", () => {
        const roomId = createNewRoom("USER_ADDED");
        const userId = "NTAP1";
        expect(addUser(roomId, userId)).toBeTruthy();
        expect(addUser(roomId, userId)).not.toBeTruthy();
        expect(uniqueNamesGenerator).toHaveBeenCalledTimes(1);
    });

    it("Doesn't remove from not existing room", () => {
        expect(removeUser("RNE1", "UNE1")).not.toBeTruthy();
    });

    it("Doesn't remove if isn't in room", () => {
        const roomId = createNewRoom("DNRIR");
        expect(removeUser(roomId, "DNRIR1")).not.toBeTruthy();
    })

    it("Remove correctly user", () => {
        const roomId = createNewRoom("USER_REMOVED_OK");
        const userId1 = "URO1";
        const userId2 = "URO2";
        expect(addUser(roomId, userId1)).toBeTruthy();
        expect(addUser(roomId, userId2)).toBeTruthy();
        expect(isParticipantInARoom(userId1)).toBeTruthy();
        expect(isParticipantInARoom(userId2)).toBeTruthy();
        expect(removeUser(roomId, userId1)).toBeTruthy();
        expect(isParticipantInARoom(userId2)).toBeTruthy();
    });

    it("Retrieve participants", () => {
        const roomId = createNewRoom("PARTICIPANTS");
        const userId = "PARTICIPANT_1";
        expect(addUser(roomId, userId)).toBeTruthy();
        expect(isParticipantInARoom(userId)).toBeTruthy();
        expect(retrieveRoomParticipants(roomId)[0]?.id).toBe(userId);
    });

    it("Retrieve empty participants list", () => {
        expect(retrieveRoomParticipants("RETRIEVE_EMTPY_LIST")).toStrictEqual([]);
    });
});