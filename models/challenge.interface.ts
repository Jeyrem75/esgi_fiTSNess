import {Timestamps} from "./timestamps";
import {User} from "./user.interface";
import {Gym} from "./gym.interface";
import { ChallengeReward } from "./challenge-reward.interface";
import { ChallengeExercise } from "./challenge-exercise.interface";

export enum ChallengeDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD',
    EXTREME = 'EXTREME'
}

export enum ChallengeCategory {
    STRENGTH = 'STRENGTH',
    CARDIO = 'CARDIO',
    FLEXIBILITY = 'FLEXIBILITY',
    ENDURANCE = 'ENDURANCE',
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    MUSCLE_GAIN = 'MUSCLE_GAIN',
    GENERAL_FITNESS = 'GENERAL_FITNESS'
}

export interface Challenge extends Timestamps {
    _id: string;
    title: string;
    description: string;
    exercises: ChallengeExercise[];
    duration: number;
    difficulty: ChallengeDifficulty;
    objectives: string[];
    rules: string[];
    startDate: Date;
    endDate: Date;
    maxParticipants?: number;
    rewards: ChallengeReward[];
    creator: string | User;
    gym?: string | Gym;
    isActive: boolean;
    category: ChallengeCategory;
}