import path from "path";

import {Decoder} from "../Decoder";
import VideoBrowserDecoder from "../VideoBrowserDecoder";

describe("VideoDecoder tests", () => {

    let decoder: Decoder;

    beforeEach(() => {
        decoder = new VideoBrowserDecoder(path.join(__dirname, 'test_jellyfish.mkv'));
    });

    afterEach(() => {
        decoder.stop()
    });

    it("Can start correctly", () => {
        expect(decoder.start()).toBeTruthy();
        expect(decoder.getStream().destroyed).not.toBeTruthy();
    });

    it("Stop fails because missing start", () => {
        expect(decoder.stop()).not.toBeTruthy();
    });

    it("Stop ok after start", () => {
        expect(decoder.start()).toBeTruthy();
        expect(decoder.stop()).toBeTruthy();
        expect(decoder.getStream().destroyed).not.toBeTruthy();
    });

    it("Stop ok even after seek", () => {
        expect(decoder.start()).toBeTruthy();
        expect(decoder.seek(1)).toBeTruthy();
        expect(decoder.stop()).toBeTruthy();
        expect(decoder.getStream().destroyed).not.toBeTruthy();
    });

    it("Seek doesn't create a new stream and but use the previous one", () => {
        expect(decoder.start()).toBeTruthy();
        const startStream = decoder.getStream();
        expect(decoder.seek(1)).toBeTruthy();
        const seekStream = decoder.getStream();
        expect(startStream).toStrictEqual(seekStream);
        expect(startStream.destroyed).not.toBeTruthy();
        expect(seekStream.destroyed).not.toBeTruthy();
    });

    it("A new start use the previous stream", () => {
        decoder.start();
        const startStream1 = decoder.getStream();
        decoder.start();
        const startStream2 = decoder.getStream();
        expect(startStream1).toStrictEqual(startStream2);
        expect(startStream1.destroyed).not.toBeTruthy();
        expect(startStream2.destroyed).not.toBeTruthy();
    });
})