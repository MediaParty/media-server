import {
    addParticipantToRoom,
    createInitialParticipantData,
    isParticipantInARoom,
    ParticipantData,
    removeParticipant as removeParticipantManager
} from "./ParticipantManager";

const ROOM_CODE_LENGTH = 6 as const;
const ROOM_CODE_MAX_VALUE = Math.pow(10, ROOM_CODE_LENGTH);
const ROOM_CODE_MIN_VALUE = Math.pow(10, ROOM_CODE_LENGTH - 1);
const INTEGER_DIGITS = 0 as const;

const roomsSessions = new Map<string, RoomData>();

const generateRoomId = () => {
    const randomNumberId = Math.random() * (ROOM_CODE_MAX_VALUE - ROOM_CODE_MIN_VALUE) + ROOM_CODE_MIN_VALUE;
    return randomNumberId.toFixed(INTEGER_DIGITS);
}

export interface RoomData {
    id: string,
    name: string,
    participants: ParticipantData[]
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

export const addParticipant = (roomId: string, participantId: string) => {
    const canAddUser = isRoomAvailable(roomId) && !isParticipantInARoom(participantId);
    if (canAddUser) {
        addParticipantToRoom(participantId, roomId);
        retrieveRoomParticipants(roomId).push(createInitialParticipantData(participantId));
    }
    return canAddUser;
}

export const removeParticipant = (roomId: string, participantId: string) => {
    let userRemoved = false;
    if (isRoomAvailable(roomId)) {
        userRemoved = removeParticipantFromRoom(roomId, participantId);
        userRemoved && removeParticipantManager(participantId);
    }
    return userRemoved;
}

export const retrieveRoomParticipants = (roomId: string) => roomsSessions.get(roomId)?.participants || [];

const removeParticipantFromRoom = (roomId: string, participantId: string) => {
    const participants = retrieveRoomParticipants(roomId);
    const participantIndex = participants.findIndex(participant => participant.id === participantId);
    const userRemoved = participantIndex !== -1;
    userRemoved && participants.splice(participantIndex, 1);
    return userRemoved;
}