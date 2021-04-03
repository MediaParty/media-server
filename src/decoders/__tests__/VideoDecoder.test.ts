import {videoDecoder} from "../VideoDecoder";

describe("VideoDecoder tests", () => {
    it("Can start correctly", () => {
        expect(videoDecoder().start()).toBeTruthy()
    })

    it("Stop fails", () => {
        expect(videoDecoder().stop()).not.toBeTruthy()
    })

    it("Seek fails", () => {
        expect(videoDecoder().seek(-15)).not.toBeTruthy()
    })
})