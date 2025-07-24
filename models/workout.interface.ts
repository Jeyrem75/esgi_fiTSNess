import {Timestamps} from "./timestamps";
import {User} from "./user.interface";
import {Challenge} from "./challenge.interface";
import {Gym} from "./gym.interface";
import {Exercise} from "./exercise.interface";

export interface WorkoutExercise {
    exercise: string | Exercise;
    sets: WorkoutSet[];
    notes?: string;
}

export interface WorkoutSet {
    reps?: number;
    weight?: number;
    duration?: number;
    restTime?: number;
}

export interface WorkoutSession extends Timestamps {
    _id: string;
    user: string | User;
    challenge?: string | Challenge;
    gym?: string | Gym;
    exercises: WorkoutExercise[];
    duration: number;
    caloriesBurned?: number;
    notes?: string;
    sessionDate: Date;
}