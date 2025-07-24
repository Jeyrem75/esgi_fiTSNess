import {Schema} from "mongoose";
import {UserBadge} from "../../../models";

export function userBadgeSchema(): Schema<UserBadge> {
    return new Schema<UserBadge>({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        badge: {
            type: Schema.Types.ObjectId,
            ref: 'Badge',
            required: true
        },
        earnedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }, {
        timestamps: true,
        collection: "userBadges",
        versionKey: false,
    });
}