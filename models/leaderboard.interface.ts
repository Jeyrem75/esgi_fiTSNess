import {Timestamps} from "./timestamps";
import {User} from "./user.interface";
import {Challenge} from "./challenge.interface";

export interface Leaderboard extends Timestamps {
    _id: string;
    challenge: string | Challenge;
    rankings: LeaderboardEntry[];
    lastUpdated: Date;
}

export interface LeaderboardEntry {
    user: string | User;
    score: number;
    position: number;
    completedAt?: Date;
}