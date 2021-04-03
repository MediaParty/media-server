import {Decoder} from "../Decoder";
import {videoBrowserDecoder} from "../VideoBrowserDecoder";

describe("VideoDecoder tests", () => {

    let decoder: Decoder;

    beforeEach(() => {
        decoder = videoBrowserDecoder('./src/decoders/__tests__/test_jellyfish.mkv');
    });

    afterEach(() => {
        decoder.stop()
    });

    it("Can start correctly", () => {
        const startedBrowserDecoder = decoder.start();
        expect(startedBrowserDecoder.destroyed).not.toBeTruthy();
    });

    it("Stop fails because missing start", () => {
        expect(decoder.stop()).not.toBeTruthy();
    });

    it("Stop ok after start", () => {
        const startStream = decoder.start();
        expect(decoder.stop()).toBeTruthy();
        expect(startStream.destroyed).toBeTruthy()
    });

    it("Stop ok even after seek", () => {
        const startStream = decoder.start();
        const seekStream = decoder.seek(1);
        expect(decoder.stop()).toBeTruthy();
        expect(startStream.destroyed).toBeTruthy();
        expect(seekStream.destroyed).toBeTruthy();
    });

    it("Seek create a new stream and stop the previous one", () => {
        const startStream = decoder.start();
        const seekStream = decoder.seek(1);
        expect(startStream).not.toStrictEqual(seekStream);
        expect(startStream.destroyed).toBeTruthy()
        expect(seekStream.destroyed).not.toBeTruthy()
    });

    it("A new start stop previous stream", () => {
        const startStream1 = decoder.start();
        const startStream2 = decoder.start();
        expect(startStream1).not.toStrictEqual(startStream2)
        expect(startStream1.destroyed).toBeTruthy()
        expect(startStream2.destroyed).not.toBeTruthy()
    });
})