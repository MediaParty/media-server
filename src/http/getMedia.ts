import {FastifyPluginCallback, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {FromSchema} from "json-schema-to-ts";
import {addParticipant} from "../sessions-manager/RoomsManager";

const paramsSchema = {
    type: 'object',
    properties: {
        roomId: {
            type: 'string'
        },
        participantId: {
            type: 'string'
        }
    },
    required: ['roomId', 'participantId']
} as const;

type Params = FromSchema<typeof paramsSchema>;

const getMediaSchema: RouteShorthandOptions = {
    schema: {
        params: paramsSchema
    }
} as const;

const getMediaEndpoint = '/room/:roomId/participant/:participantId' as const;

export const getMedia: FastifyPluginCallback = (fastifyInstance, _, done) => {
    fastifyInstance.get<{ Params: Params }>(getMediaEndpoint, getMediaSchema, mediaHandler);
    done();
};

const mediaHandler = (request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) => {
    const {roomId, participantId} = request.params
    addParticipant(roomId, participantId, reply)
}
