"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutSessionSchema = workoutSessionSchema;
const mongoose_1 = require("mongoose");
const workoutSetSchema = new mongoose_1.Schema({
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
const workoutExerciseSchema = new mongoose_1.Schema({
    exercise: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    sets: [workoutSetSchema],
    notes: {
        type: String
    }
}, { _id: false });
function workoutSessionSchema() {
    return new mongoose_1.Schema({
        user: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        challenge: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Challenge'
        },
        gym: {
            type: mongoose_1.Schema.Types.ObjectId,
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
