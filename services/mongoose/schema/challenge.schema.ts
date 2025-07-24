import {Schema} from "mongoose";
import {Challenge, ChallengeDifficulty, ChallengeCategory, RewardType} from "../../../models";

const challengeExerciseSchema = new Schema({
    exercise: {
        type: Schema.Types.ObjectId,
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

const challengeRewardSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: Object.values(RewardType)
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

export function challengeSchema(): Schema<Challenge> {
    return new Schema<Challenge>({
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
            enum: Object.values(ChallengeDifficulty)
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
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        gym: {
            type: Schema.Types.ObjectId,
            ref: 'Gym'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        category: {
            type: String,
            required: true,
            enum: Object.values(ChallengeCategory)
        }
    }, {
        timestamps: true,
        collection: "challenges",
        versionKey: false,
    });
}