import {Socket} from "socket.io";

import {destroyRoom, removeParticipant, retrieveRoomParticipants} from "../../sessions-manager/RoomsManager";
import {mediaPartyLogger} from "../../logger";
import {retrieveParticipantRoom} from "../../sessions-manager/ParticipantManager";

export const disconnectionHandlerBuilder = (socket: Socket) => {
    const participantId = socket.id;
    return (disconnectionReason: string) => {
        const roomId = retrieveParticipantRoom(participantId);
        mediaPartyLogger.info(`Particioant ${participantId} - room ${roomId} - disconnected due to ${disconnectionReason}`);
        removeParticipant(participantId);
        manageRoomDestruction(roomId);
    }
}

const manageRoomDestruction = (roomId?: string) => {
    const isRoomToRemove = shouldRemoveRoom(roomId);
    if (roomId && isRoomToRemove) {
        destroyRoom(roomId);
    }
}

const shouldRemoveRoom = (roomId?: string) => {
    let isRoomToRemove = false;
    if (roomId) {
        const participants = retrieveRoomParticipants(roomId);
        isRoomToRemove = participants.length === 0;
    }
    return isRoomToRemove;
}