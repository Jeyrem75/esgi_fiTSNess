"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardSchema = leaderboardSchema;
const mongoose_1 = require("mongoose");
const leaderboardEntrySchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
function leaderboardSchema() {
    return new mongoose_1.Schema({
        challenge: {
            type: mongoose_1.Schema.Types.ObjectId,
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
