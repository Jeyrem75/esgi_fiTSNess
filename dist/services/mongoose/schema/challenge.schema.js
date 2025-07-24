"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeSchema = challengeSchema;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
const challengeExerciseSchema = new mongoose_1.Schema({
    exercise: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    sets: {
        type: Number
    },
    reps: {
        type: Number
    },
    duration: {
        type: Number
    },
    weight: {
        type: Number
    },
    restTime: {
        type: Number
    }
}, { _id: false });
const challengeRewardSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: Object.values(models_1.RewardType)
    },
    value: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { _id: false });
function challengeSchema() {
    return new mongoose_1.Schema({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        exercises: [challengeExerciseSchema],
        duration: {
            type: Number,
            required: true
        },
        difficulty: {
            type: String,
            required: true,
            enum: Object.values(models_1.ChallengeDifficulty)
        },
        objectives: [{
                type: String,
                required: true
            }],
        rules: [{
                type: String,
                required: true
            }],
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        maxParticipants: {
            type: Number
        },
        rewards: [challengeRewardSchema],
        creator: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        gym: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Gym'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        category: {
            type: String,
            required: true,
            enum: Object.values(models_1.ChallengeCategory)
        }
    }, {
        timestamps: true,
        collection: "challenges",
        versionKey: false,
    });
}
