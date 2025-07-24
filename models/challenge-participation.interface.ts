import { Challenge } from "./challenge.interface";
import { Timestamps } from "./timestamps";
import { User } from "./user.interface";
import { WorkoutSession } from "./workout.interface";

export interface ChallengeParticipation extends Timestamps {
    _id: string;
    user: string | User;
    challenge: string | Challenge;
    joinedAt: Date;
    completedAt?: Date;
    progress: number;
    workoutSessions: WorkoutSession[];
    isCompleted: boolean;
    finalScore?: number;
}