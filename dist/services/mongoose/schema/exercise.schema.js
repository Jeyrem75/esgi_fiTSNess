"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exerciseSchema = exerciseSchema;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
function exerciseSchema() {
    return new mongoose_1.Schema({
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
            enum: Object.values(models_1.ExerciseDifficulty)
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
