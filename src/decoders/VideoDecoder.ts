import {Decoder} from "./Decoder";

export function videoDecoder(): Decoder {
    return {
        start: () => {
            return true
        },
        stop: () => {
            return false
        },
        seek: (seconds: number) => {
            return seconds > 0
        }
    }
}