import {Decoder} from "./Decoder";
import ffmpeg from "fluent-ffmpeg";
import {Writable} from "stream";

const BROWSER_SUPPORTED_FORMAT = 'mp4';
const DECODE_BROWSER_SUPPORT = ['-movflags', '+frag_keyframe+empty_moov+faststart', '-map', '0:0', '-preset', 'ultrafast'];

export function videoBrowserDecoder(videoPath: string): Decoder {
    const ffmpegBuilder = (secondsSeek: number = 0) => {
        return ffmpeg(videoPath)
            .seekInput(secondsSeek)
            .outputFormat(BROWSER_SUPPORTED_FORMAT)
            .outputOptions(DECODE_BROWSER_SUPPORT)
            .on('error', () => {})
    }

    let ffmpegStream: Writable;

    const stop = () => {
        const canBeStopped = ffmpegStream && true;
        if (canBeStopped) {
            ffmpegStream.end();
            ffmpegStream.destroy();
        }
        return canBeStopped;
    }

    return {
        stop,
        start: () => {
            stop()
            const writeableStream = new Writable();
            ffmpegStream = ffmpegBuilder().pipe(writeableStream, {end: false});
            return writeableStream;
        },
        seek: (seconds: number) => {
            stop();
            const writeableStream = new Writable();
            ffmpegStream = ffmpegBuilder(seconds).pipe(writeableStream, {end: false});
            return writeableStream;
        }
    }
}