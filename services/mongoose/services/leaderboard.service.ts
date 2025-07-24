import {Mongoose, Model, isValidObjectId} from "mongoose";
import {Leaderboard} from "../../../models";
import {leaderboardSchema} from "../schema";

export type CreateLeaderboard = Omit<Leaderboard, '_id' | 'createdAt' | 'updatedAt'>;

export class LeaderboardService {
    readonly leaderboardModel: Model<Leaderboard>;

    constructor(public readonly connection: Mongoose) {
        this.leaderboardModel = connection.model('Leaderboard', leaderboardSchema());
    }

    async createLeaderboard(leaderboard: CreateLeaderboard): Promise<Leaderboard> {
        return this.leaderboardModel.create(leaderboard);
    }

    async findLeaderboard(challengeId: string): Promise<Leaderboard | null> {
        if(!isValidObjectId(challengeId)) {
            return null;
        }
        return this.leaderboardModel.findOne({ challenge: challengeId })
            .populate('challenge')
            .populate('rankings.user');
    }

    async updateLeaderboard(challengeId: string, rankings: any[]): Promise<Leaderboard | null> {
        if(!isValidObjectId(challengeId)) {
            return null;
        }
        return this.leaderboardModel.findOneAndUpdate(
            { challenge: challengeId },
            { 
                rankings,
                lastUpdated: new Date()
            },
            { new: true, upsert: true }
        ).populate('challenge').populate('rankings.user');
    }

    async findUserLeaderboards(userId: string): Promise<Leaderboard[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.leaderboardModel.find({
            'rankings.user': userId
        }).populate('challenge').populate('rankings.user');
    }

    async deleteLeaderboard(challengeId: string): Promise<void> {
        if(!isValidObjectId(challengeId)) {
            return;
        }
        await this.leaderboardModel.deleteOne({ challenge: challengeId });
    }
}