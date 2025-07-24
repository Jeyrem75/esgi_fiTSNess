import {Timestamps} from "./timestamps";

export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    GYM_OWNER = 'GYM_OWNER',
    USER = 'USER'
}

export enum FitnessLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    EXPERT = 'EXPERT'
}

export function getUserRoleLevel(role: UserRole): number {
    switch (role) {
        case UserRole.SUPER_ADMIN:
            return 999;
        case UserRole.GYM_OWNER:
            return 100;
        default:
            return 1;
    }
}

export interface UserPreferences {
    notifications: NotificationPreferences;
    privacy: PrivacyPreferences;
    units: UnitPreferences;
}

export interface NotificationPreferences {
    challengeInvites: boolean;
    friendRequests: boolean;
    achievements: boolean;
    workoutReminders: boolean;
    challengeUpdates: boolean;
}

export interface PrivacyPreferences {
    profileVisibility: ProfileVisibility;
    workoutVisibility: WorkoutVisibility;
    friendsListVisibility: FriendsListVisibility;
}

export enum ProfileVisibility {
    PUBLIC = 'PUBLIC',
    FRIENDS_ONLY = 'FRIENDS_ONLY',
    PRIVATE = 'PRIVATE'
}

export enum WorkoutVisibility {
    PUBLIC = 'PUBLIC',
    FRIENDS_ONLY = 'FRIENDS_ONLY',
    PRIVATE = 'PRIVATE'
}

export enum FriendsListVisibility {
    PUBLIC = 'PUBLIC',
    FRIENDS_ONLY = 'FRIENDS_ONLY',
    PRIVATE = 'PRIVATE'
}

export interface UnitPreferences {
    weight: WeightUnit;
    distance: DistanceUnit;
    temperature: TemperatureUnit;
}

export enum WeightUnit {
    KG = 'KG',
    LB = 'LB'
}

export enum DistanceUnit {
    KM = 'KM',
    MI = 'MI'
}

export enum TemperatureUnit {
    CELSIUS = 'CELSIUS',
    FAHRENHEIT = 'FAHRENHEIT'
}

export interface User extends Timestamps {
    _id: string;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    profileImage?: string;
    dateOfBirth?: Date;
    height?: number;
    weight?: number;
    fitnessLevel?: FitnessLevel;
    goals?: string[];
    totalScore: number;
    preferences: UserPreferences;
}