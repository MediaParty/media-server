import {Writable} from "stream";
import {adjectives, animals, Config, uniqueNamesGenerator} from "unique-names-generator";

const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_MAX_VALUE = Math.pow(10, ROOM_CODE_LENGTH);
const ROOM_CODE_MIN_VALUE = Math.pow(10, ROOM_CODE_LENGTH - 1);
const INTEGER_DIGITS = 0;

const roomsSessions = new Map<string, RoomData>();
const usersSessions = new Map<string, string>();
const nameGeneratorConfig: Config = {
    dictionaries: [adjectives, animals]
};

const generateRoomId = () => {
    const randomNumberId = Math.random() * (ROOM_CODE_MAX_VALUE - ROOM_CODE_MIN_VALUE) + ROOM_CODE_MIN_VALUE;
    return randomNumberId.toFixed(INTEGER_DIGITS);
}

export interface RoomData {
    id: string,
    name: string,
    participants: ParticipantData[]
}

export interface ParticipantData {
    id: string,
    name: string,
    stream?: Writable
}

export const createNewRoom = (roomName: string) => {
    const roomId = generateRoomId();
    const roomData = {
        id: roomId,
        name: roomName,
        participants: []
    }
    roomsSessions.set(roomId, roomData);
    return roomId;
}

export const isRoomAvailable = (roomId: string) => {
    return roomsSessions.has(roomId);
}

export const isParticipantInARoom = (userId: string) => {
    return usersSessions.has(userId);
}

export const addUser = (roomId: string, userId: string) => {
    const canAddUser = isRoomAvailable(roomId) && !isParticipantInARoom(userId);
    if (canAddUser) {
        retrieveRoomParticipants(roomId).push({
            id: userId,
            name: uniqueNamesGenerator(nameGeneratorConfig)
        })
        usersSessions.set(userId, roomId)
    }
    return canAddUser;
}

export const removeUser = (roomId: string, userId: string) => {
    let userRemoved = false;
    if (isRoomAvailable(roomId)) {
        const participants = retrieveRoomParticipants(roomId);
        const participantIndex = participants.findIndex(participant => participant.id === userId);
        userRemoved = participantIndex !== -1;
        userRemoved && participants.splice(participantIndex, 1);
    }
    return userRemoved;
}

export const retrieveRoomParticipants = (roomId: string) => roomsSessions.get(roomId)?.participants || [];