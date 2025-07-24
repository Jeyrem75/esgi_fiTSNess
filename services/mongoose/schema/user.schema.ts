import {Schema} from "mongoose";
import {User, UserRole, FitnessLevel, ProfileVisibility, WorkoutVisibility, FriendsListVisibility, WeightUnit, DistanceUnit, TemperatureUnit} from "../../../models";

const notificationPreferencesSchema = new Schema({
    challengeInvites: { type: Boolean, default: true },
    friendRequests: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    workoutReminders: { type: Boolean, default: true },
    challengeUpdates: { type: Boolean, default: true }
}, { _id: false });

const privacyPreferencesSchema = new Schema({
    profileVisibility: { 
        type: String, 
        enum: Object.values(ProfileVisibility),
        default: ProfileVisibility.PUBLIC 
    },
    workoutVisibility: { 
        type: String, 
        enum: Object.values(WorkoutVisibility),
        default: WorkoutVisibility.FRIENDS_ONLY 
    },
    friendsListVisibility: { 
        type: String, 
        enum: Object.values(FriendsListVisibility),
        default: FriendsListVisibility.FRIENDS_ONLY 
    }
}, { _id: false });

const unitPreferencesSchema = new Schema({
    weight: { 
        type: String, 
        enum: Object.values(WeightUnit),
        default: WeightUnit.KG 
    },
    distance: { 
        type: String, 
        enum: Object.values(DistanceUnit),
        default: DistanceUnit.KM 
    },
    temperature: { 
        type: String, 
        enum: Object.values(TemperatureUnit),
        default: TemperatureUnit.CELSIUS 
    }
}, { _id: false });

const userPreferencesSchema = new Schema({
    notifications: notificationPreferencesSchema,
    privacy: privacyPreferencesSchema,
    units: unitPreferencesSchema
}, { _id: false });

export function userSchema(): Schema<User> {
    return new Schema<User>({
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
            enum: Object.values(UserRole)
        },
        isActive: {
            type: Boolean,
            default: true
        },
        profileImage: {
            type: String
        },
        dateOfBirth: {
            type: Date
        },
        height: {
            type: Number
        },
        weight: {
            type: Number
        },
        fitnessLevel: {
            type: String,
            enum: Object.values(FitnessLevel)
        },
        goals: [{
            type: String
        }],
        totalScore: {
            type: Number,
            default: 0
        },
        preferences: {
            type: userPreferencesSchema,
            default: () => ({
                notifications: {
                    challengeInvites: true,
                    friendRequests: true,
                    achievements: true,
                    workoutReminders: true,
                    challengeUpdates: true
                },
                privacy: {
                    profileVisibility: ProfileVisibility.PUBLIC,
                    workoutVisibility: WorkoutVisibility.FRIENDS_ONLY,
                    friendsListVisibility: FriendsListVisibility.FRIENDS_ONLY
                },
                units: {
                    weight: WeightUnit.KG,
                    distance: DistanceUnit.KM,
                    temperature: TemperatureUnit.CELSIUS
                }
            })
        }
    }, {
        timestamps: true,
        collection: "users",
        versionKey: false,
    });
}