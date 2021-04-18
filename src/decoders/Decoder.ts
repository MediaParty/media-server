import Stream from "stream";

export interface Decoder {
    start: () => boolean,
    stop: () => boolean,
    seek: (seconds: number) => boolean,
    getStream: () => Stream.Readable
}