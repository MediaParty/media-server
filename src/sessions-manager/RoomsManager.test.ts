import {createNewRoom} from "./RoomsManager";

describe("Sessionsmanager tests", () => {
    it("Create correctly a new room", () => {
        const roomId = createNewRoom('Test room')
        const roomNumber = parseInt(roomId)
        expect(roomNumber).toBeGreaterThan(99999)
        expect(roomNumber).toBeLessThanOrEqual(999999)
        expect(roomId.length).toBe(6)
    })
})