import {FastifyReply} from "fastify";

import { Decoder } from "../decoders/Decoder";
import {videoBrowserDecoder} from "../decoders/VideoBrowserDecoder";
import {
    addParticipantToRoom,
    createInitialParticipantData,
    isParticipantInARoom,
    ParticipantData,
    removeParticipant as removeParticipantManager,
    retrieveParticipantRoom
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
    participants: ParticipantData[],
    decoder: Decoder
}

export const createNewRoom = (roomName: string, mediaLink: string) => {
    const roomId = generateRoomId();
    const roomData = {
        id: roomId,
        name: roomName,
        participants: [],
        decoder: videoBrowserDecoder(mediaLink)
    }
    roomsSessions.set(roomId, roomData);
    return roomId;
}

export const destroyRoom = (roomId: string) => {
    return roomsSessions.delete(roomId);
}

export const isRoomAvailable = (roomId: string) => {
    return roomsSessions.has(roomId);
}

export const addParticipant = (roomId: string, participantId: string, fastifyReply: FastifyReply) => {
    const canAddUser = isRoomAvailable(roomId) && !isParticipantInARoom(participantId);
    if (canAddUser) {
        addParticipantToRoom(participantId, roomId);
        retrieveRoomParticipants(roomId).push(createInitialParticipantData(participantId, fastifyReply));
    }
    return canAddUser;
}

export const removeParticipant = (participantId: string) => {
    let userRemoved = false;
    const roomId = retrieveParticipantRoom(participantId);
    if (roomId && isRoomAvailable(roomId)) {
        userRemoved = removeParticipantFromRoom(roomId, participantId);
        userRemoved = userRemoved && removeParticipantManager(participantId);
    }
    return userRemoved;
}


export const retrieveRoomParticipants = (roomId: string) => retrieveRoomData(roomId)?.participants || [];

export const retrieveRoomData = (roomId: string) => roomsSessions.get(roomId);

const removeParticipantFromRoom = (roomId: string, participantId: string) => {
    const participants = retrieveRoomParticipants(roomId);
    const participantIndex = participants.findIndex(participant => participant.id === participantId);
    const userRemoved = participantIndex !== -1;
    userRemoved && participants.splice(participantIndex, 1);
    return userRemoved;
}