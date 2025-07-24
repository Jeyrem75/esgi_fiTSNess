"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeParticipationSchema = challengeParticipationSchema;
const mongoose_1 = require("mongoose");
function challengeParticipationSchema() {
    return new mongoose_1.Schema({
        user: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        challenge: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Challenge',
            required: true
        },
        joinedAt: {
            type: Date,
            required: true,
            default: Date.now
        },
        completedAt: {
            type: Date
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        workoutSessions: [{
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'WorkoutSession'
            }],
        isCompleted: {
            type: Boolean,
            default: false
        },
        finalScore: {
            type: Number
        }
    }, {
        timestamps: true,
        collection: "challengeParticipations",
        versionKey: false,
    });
}
