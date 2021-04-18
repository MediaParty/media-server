import {Decoder} from "./Decoder";
import ffmpeg from "fluent-ffmpeg";
import {Writable} from "stream";

const BROWSER_SUPPORTED_FORMAT = 'mp4';
const DECODE_BROWSER_SUPPORT = ['-movflags', '+frag_keyframe+empty_moov+faststart', '-map', '0:0', '-preset', 'ultrafast'];
const FFMPEG_KILL_SIGNAL = "SIGKILL";

export function videoBrowserDecoder(videoPath: string): Decoder {
    const ffmpegBuilder = (secondsSeek: number = 0) => {
        ffmpegInstance = ffmpeg(videoPath)
            .seekInput(secondsSeek)
            .outputFormat(BROWSER_SUPPORTED_FORMAT)
            .outputOptions(DECODE_BROWSER_SUPPORT)
            .on('error', () => {
            });
        ffmpegInstance.pipe(writeableStream, {end: false});
    }

    const writeableStream = new Writable();
    let ffmpegInstance: ffmpeg.FfmpegCommand;

    return {
        seek: function (seconds: number) {
            const hasBeenStopped = ffmpegInstance ? this.stop() : true;
            ffmpegBuilder(seconds);
            return ffmpegInstance && hasBeenStopped;
        },
        start: function () {
            return this.seek(0);
        },
        stop: () => {
            const canBeStopped = ffmpegInstance && true;
            if (canBeStopped) {
                ffmpegInstance.kill(FFMPEG_KILL_SIGNAL);
            }
            return canBeStopped;
        },
        getStream: () => {
            return writeableStream;
        }
    }
}