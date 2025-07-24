import {Schema} from "mongoose";
import {WorkoutSession} from "../../../models";

const workoutSetSchema = new Schema({
    reps: {
        type: Number
    },
    weight: {
        type: Number
    },
    duration: {
        type: Number
    },
    restTime: {
        type: Number
    }
}, { _id: false });

const workoutExerciseSchema = new Schema({
    exercise: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    sets: [workoutSetSchema],
    notes: {
        type: String
    }
}, { _id: false });

export function workoutSessionSchema(): Schema<WorkoutSession> {
    return new Schema<WorkoutSession>({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        challenge: {
            type: Schema.Types.ObjectId,
            ref: 'Challenge'
        },
        gym: {
            type: Schema.Types.ObjectId,
            ref: 'Gym'
        },
        exercises: [workoutExerciseSchema],
        duration: {
            type: Number,
            required: true
        },
        caloriesBurned: {
            type: Number
        },
        notes: {
            type: String
        },
        sessionDate: {
            type: Date,
            required: true,
            default: Date.now
        }
    }, {
        timestamps: true,
        collection: "workoutSessions",
        versionKey: false,
    });
}