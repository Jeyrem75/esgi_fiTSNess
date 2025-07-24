"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = userSchema;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
const notificationPreferencesSchema = new mongoose_1.Schema({
    challengeInvites: { type: Boolean, default: true },
    friendRequests: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    workoutReminders: { type: Boolean, default: true },
    challengeUpdates: { type: Boolean, default: true }
}, { _id: false });
const privacyPreferencesSchema = new mongoose_1.Schema({
    profileVisibility: {
        type: String,
        enum: Object.values(models_1.ProfileVisibility),
        default: models_1.ProfileVisibility.PUBLIC
    },
    workoutVisibility: {
        type: String,
        enum: Object.values(models_1.WorkoutVisibility),
        default: models_1.WorkoutVisibility.FRIENDS_ONLY
    },
    friendsListVisibility: {
        type: String,
        enum: Object.values(models_1.FriendsListVisibility),
        default: models_1.FriendsListVisibility.FRIENDS_ONLY
    }
}, { _id: false });
const unitPreferencesSchema = new mongoose_1.Schema({
    weight: {
        type: String,
        enum: Object.values(models_1.WeightUnit),
        default: models_1.WeightUnit.KG
    },
    distance: {
        type: String,
        enum: Object.values(models_1.DistanceUnit),
        default: models_1.DistanceUnit.KM
    },
    temperature: {
        type: String,
        enum: Object.values(models_1.TemperatureUnit),
        default: models_1.TemperatureUnit.CELSIUS
    }
}, { _id: false });
const userPreferencesSchema = new mongoose_1.Schema({
    notifications: notificationPreferencesSchema,
    privacy: privacyPreferencesSchema,
    units: unitPreferencesSchema
}, { _id: false });
function userSchema() {
    return new mongoose_1.Schema({
        lastName: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: Object.values(models_1.UserRole)
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true
        },
        profileImage: {
            type: String,
            required: false
        },
        dateOfBirth: {
            type: Date,
            required: false
        },
        height: {
            type: Number,
            required: false
        },
        weight: {
            type: Number,
            required: false
        },
        fitnessLevel: {
            type: String,
            enum: Object.values(models_1.FitnessLevel),
            required: false
        },
        goals: [{
                type: String
            }],
        totalScore: {
            type: Number,
            default: 0,
            required: false
        },
        preferences: {
            type: userPreferencesSchema,
            required: false,
            default: () => ({
                notifications: {
                    challengeInvites: true,
                    friendRequests: true,
                    achievements: true,
                    workoutReminders: true,
                    challengeUpdates: true
                },
                privacy: {
                    profileVisibility: models_1.ProfileVisibility.PUBLIC,
                    workoutVisibility: models_1.WorkoutVisibility.FRIENDS_ONLY,
                    friendsListVisibility: models_1.FriendsListVisibility.FRIENDS_ONLY
                },
                units: {
                    weight: models_1.WeightUnit.KG,
                    distance: models_1.DistanceUnit.KM,
                    temperature: models_1.TemperatureUnit.CELSIUS
                }
            })
        }
    }, {
        timestamps: true,
        collection: "users",
        versionKey: false,
    });
}
