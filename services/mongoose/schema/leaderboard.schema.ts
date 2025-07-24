import {Schema} from "mongoose";
import {Leaderboard} from "../../../models";

const leaderboardEntrySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    completedAt: {
        type: Date
    }
}, { _id: false });

export function leaderboardSchema(): Schema<Leaderboard> {
    return new Schema<Leaderboard>({
        challenge: {
            type: Schema.Types.ObjectId,
            ref: 'Challenge',
            required: true
        },
        rankings: [leaderboardEntrySchema],
        lastUpdated: {
            type: Date,
            required: true,
            default: Date.now
        }
    }, {
        timestamps: true,
        collection: "leaderboards",
        versionKey: false,
    });
}