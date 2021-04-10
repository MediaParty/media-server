import {removeParticipant} from "../../sessions-manager/RoomsManager";
import {Socket} from "socket.io";
import {mediaPartyLogger} from "../../logger";

export const disconnectionHandlerBuilder = (socket: Socket) => {
    const participantId = socket.id;
    return (disconnectionReason: string) => {
        mediaPartyLogger.info(`Particioant ${participantId} disconnected due to ${disconnectionReason}`);
        removeParticipant(participantId);
    }
}