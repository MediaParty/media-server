import {createNewRoom, retrieveRoomData} from "../../sessions-manager/RoomsManager";
import {Socket} from "socket.io";
import {mediaPartyLogger} from "../../logger";

type CreateRoomMessage = {
    roomName: string,
    mediaLink: string
}
type CreateRoomHandler = (socket: Socket) => (createRoomMessage: CreateRoomMessage) => void

export const createRoomHandlerBuilder: CreateRoomHandler = (socket: Socket) => {
    return ({roomName, mediaLink}) => {
        mediaPartyLogger.info(`Room ${roomName} created with media ${mediaLink}`)
        const roomId = createNewRoom(roomName, mediaLink)
        const roomData = retrieveRoomData(roomId);
        roomData && roomData.decoder.start()
        socket.emit("roomCreated", {roomId})
    }
}