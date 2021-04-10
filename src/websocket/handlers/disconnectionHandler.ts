import {removeParticipant} from "../../sessions-manager/RoomsManager";
import {Socket} from "socket.io";

export const disconnectionHandlerBuilder = (socket: Socket) => {
    const participantId = socket.id;
    return (disconnectionReason: string) => {
        console.log("[MediParty] -", `Particioant ${participantId} disconnected due to`, disconnectionReason);
        removeParticipant(participantId);
    }
}