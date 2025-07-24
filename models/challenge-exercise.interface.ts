import { Exercise } from "./exercise.interface";

export interface ChallengeExercise {
    exercise: string | Exercise;
    sets?: number;
    reps?: number;
    duration?: number;
    weight?: number;
    restTime?: number;
}