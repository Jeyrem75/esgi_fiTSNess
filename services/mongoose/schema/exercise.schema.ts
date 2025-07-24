import {Schema} from "mongoose";
import {Exercise, ExerciseDifficulty} from "../../../models";

export function exerciseSchema(): Schema<Exercise> {
    return new Schema<Exercise>({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        targetedMuscles: [{
            type: String,
            required: true
        }],
        difficulty: {
            type: String,
            required: true,
            enum: Object.values(ExerciseDifficulty)
        },
        equipment: [{
            type: String
        }],
        instructions: [{
            type: String,
            required: true
        }],
        imageUrl: {
            type: String
        },
        videoUrl: {
            type: String
        }
    }, {
        timestamps: true,
        collection: "exercises",
        versionKey: false,
    });
}