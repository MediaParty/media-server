import {addUser, createNewRoom, isParticipantInARoom, isRoomAvailable} from "./RoomsManager";
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
        const userId = "123";
        expect(isParticipantInARoom(userId)).not.toBeTruthy();
        expect(addUser(roomId, userId)).toBeTruthy();
        expect(isParticipantInARoom(userId)).toBeTruthy();
    });

    it("User doesn't partecipate to a room", () => {
        expect(isParticipantInARoom("456")).not.toBeTruthy()
    });

    it("User isn't added to not existing room", () => {
        const userId = "456";
        expect(addUser("123", userId)).not.toBeTruthy();
        expect(isParticipantInARoom(userId)).not.toBeTruthy();
    });

    it("User isn't added if already present", () => {
        const roomId = createNewRoom("USER_ADDED");
        const userId = "1234";
        expect(addUser(roomId, userId)).toBeTruthy();
        expect(addUser(roomId, userId)).not.toBeTruthy();
        expect(uniqueNamesGenerator).toHaveBeenCalledTimes(1);
    })
});