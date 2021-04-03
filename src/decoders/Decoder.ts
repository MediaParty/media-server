import Stream from "stream";

export interface Decoder {
    start: () => Stream.Writable,
    stop: () => boolean,
    seek: (seconds: number) => Stream.Writable
}