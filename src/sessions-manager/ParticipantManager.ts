import {Writable} from "stream";
import {adjectives, animals, Config, uniqueNamesGenerator} from "unique-names-generator";

const usersSessions = new Map<string, string>();

const nameGeneratorConfig: Config = {
    dictionaries: [adjectives, animals]
};

export interface ParticipantData {
    id: string,
    name: string,
    stream?: Writable
}

export const createInitialParticipantData: (participantId: string) => ParticipantData = (participantId: string) => {
    return {
        id: participantId,
        name: generateParticipantName()
    }
}

export const retrieveParticipantRoom = (participantId: string) => {
    return usersSessions.get(participantId);
}

export const isParticipantInARoom = (participantId: string) => {
    return usersSessions.has(participantId);
}

export const addParticipantToRoom = (participantId: string, roomId: string) => {
    usersSessions.set(participantId, roomId);
}

export const removeParticipant = (participantId: string) => {
    return usersSessions.delete(participantId);
}

const generateParticipantName = () => {
    return uniqueNamesGenerator(nameGeneratorConfig);
}
