import {Schema} from "mongoose";
import {Friendship, FriendshipStatus} from "../../../models";

export function friendshipSchema(): Schema<Friendship> {
    return new Schema<Friendship>({
        requester: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(FriendshipStatus),
            default: FriendshipStatus.PENDING
        }
    }, {
        timestamps: true,
        collection: "friendships",
        versionKey: false,
    });
}