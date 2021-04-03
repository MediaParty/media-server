export interface Decoder {
    start: () => boolean,
    stop: () => boolean,
    seek: (seconds: number) => boolean
}