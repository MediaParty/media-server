import {Socket} from "socket.io";
import {retrieveParticipantRoom} from "../../sessions-manager/ParticipantManager";
import {mediaPartyLogger} from "../../logger";
import {retrieveRoomData} from "../../sessions-manager/RoomsManager";

interface SeekModel {
    seekTime: number
}

export const seekHandler: (socket: Socket) => (seekModel: SeekModel) => void = (socket: Socket) => {
    const participantId = socket.id;
    return ({seekTime}) => {
        const roomId = retrieveParticipantRoom(participantId);
        mediaPartyLogger.info(`Particioant ${participantId} - room ${roomId} - seeked to ${seekTime}`);
        const roomData = roomId && retrieveRoomData(roomId);
        if (seekTime > 0 && roomData) {
            roomData.decoder.seek(seekTime);
        }
    }
}