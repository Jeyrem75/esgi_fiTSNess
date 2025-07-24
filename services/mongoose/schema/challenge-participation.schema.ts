import {Schema} from "mongoose";
import {ChallengeParticipation} from "../../../models";

export function challengeParticipationSchema(): Schema<ChallengeParticipation> {
    return new Schema<ChallengeParticipation>({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        challenge: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.ObjectId,
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