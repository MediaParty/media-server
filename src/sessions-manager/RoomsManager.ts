import {Writable} from "stream";

const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_MULTIPLIER = Math.pow(10, ROOM_CODE_LENGTH);
const INTEGER_DIGITS = 0;

const activeSessions = new Map<string, RoomData>();

const generateRoomId = () => {
    const randomNumberId = Math.random() * ROOM_CODE_MULTIPLIER;
    return randomNumberId.toFixed(INTEGER_DIGITS);
}

export interface RoomData {
    id: string,
    name: string,
    participants: ParticipantData[]
}

export interface ParticipantData {
    name: string,
    stream: Writable
}

export const createNewRoom = (roomName: string) => {
    const roomId = generateRoomId();
    const roomData = {
        id: roomId,
        name: roomName,
        participants: []
    }
    activeSessions.set(roomId, roomData);
    return roomId;
}

export const isRoomAvailable = (roomId: string) => {
    return activeSessions.has(roomId);
}