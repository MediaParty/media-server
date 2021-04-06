import {addUser, createNewRoom, isParticipantInRoom, isRoomAvailable} from "./RoomsManager";
import {uniqueNamesGenerator} from "unique-names-generator";

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

    it("Participant already in room", () => {
        const roomId = createNewRoom('participantInRoom');
        expect(isParticipantInRoom(roomId, "123")).not.toBeTruthy();
        addUser(roomId, "123")
        expect(isParticipantInRoom(roomId, "123")).toBeTruthy();
    });

    it("User doesn't partecipate to not existing room", () => {
        expect(isParticipantInRoom("fakeRoomId", "123")).not.toBeTruthy()
    });

    it("User isn't added to not existing room", () => {
        addUser("123", "456");
        expect(isParticipantInRoom("123", "456")).not.toBeTruthy();
    });

    it("User isn't added if already present", () => {
        const roomId = createNewRoom("USER_ADDED");
        addUser(roomId, "1234");
        addUser(roomId, "1234");
        expect(uniqueNamesGenerator).toHaveBeenCalledTimes(1);
    })
});