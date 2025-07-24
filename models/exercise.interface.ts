import { Timestamps } from "./timestamps";

export enum ExerciseDifficulty {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    EXPERT = 'EXPERT'
}

export interface Exercise extends Timestamps {
    _id: string;
    name: string;
    description: string;
    targetedMuscles: string[];
    difficulty: ExerciseDifficulty;
    equipment?: string[];
    instructions: string[];
    imageUrl?: string;
    videoUrl?: string;
}

