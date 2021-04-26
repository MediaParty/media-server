import {Decoder} from "./Decoder";
import ffmpeg from "fluent-ffmpeg";
import {PassThrough, Readable} from "stream";

const BROWSER_SUPPORTED_FORMAT = 'mp4';
const DECODE_BROWSER_SUPPORT = ['-movflags', '+frag_keyframe+empty_moov+faststart', '-map', '0:0', '-preset', 'ultrafast'];
const FFMPEG_KILL_SIGNAL = "SIGKILL";

export default class VideoBrowserDecoder implements Decoder {

    private readonly passThroughStream = new PassThrough();
    private ffmpegInstance: ffmpeg.FfmpegCommand | undefined;
    private videoPath: string;

    constructor(videoPath: string) {
        this.videoPath = videoPath;
    }

    getStream(): Readable {
        return this.passThroughStream;
    }

    seek(seconds: number): boolean {
        const hasBeenStopped = this.ffmpegInstance ? this.stop() : true;
        this.ffmpegBuilder(seconds);
        return Boolean(this.ffmpegInstance && hasBeenStopped);
    }

    start(): boolean {
        return this.seek(0);
    }

    stop(): boolean {
        const canBeStopped = this.ffmpegInstance !== undefined;
        if (canBeStopped) {
            this.ffmpegInstance?.kill(FFMPEG_KILL_SIGNAL);
        }
        return canBeStopped;
    }

    private ffmpegBuilder(secondsSeek: number = 0) {
        this.ffmpegInstance = ffmpeg(this.videoPath)
            .seekInput(secondsSeek)
            .outputFormat(BROWSER_SUPPORTED_FORMAT)
            .outputOptions(DECODE_BROWSER_SUPPORT)
            .on('error', () => {
            });
        this.ffmpegInstance.pipe(this.passThroughStream, {end: false});
    }
}