import {Mongoose, Model, isValidObjectId} from "mongoose";
import {ChallengeParticipation} from "../../../models";
import {challengeParticipationSchema} from "../schema";

export type CreateChallengeParticipation = Omit<ChallengeParticipation, '_id' | 'createdAt' | 'updatedAt'>;

export class ChallengeParticipationService {
    readonly challengeParticipationModel: Model<ChallengeParticipation>;

    constructor(public readonly connection: Mongoose) {
        this.challengeParticipationModel = connection.model('ChallengeParticipation', challengeParticipationSchema());
    }

    async joinChallenge(participation: CreateChallengeParticipation): Promise<ChallengeParticipation> {
        return this.challengeParticipationModel.create(participation);
    }

    async findChallengeParticipation(userId: string, challengeId: string): Promise<ChallengeParticipation | null> {
        if(!isValidObjectId(userId) || !isValidObjectId(challengeId)) {
            return null;
        }
        return this.challengeParticipationModel.findOne({ user: userId, challenge: challengeId })
            .populate('user')
            .populate('challenge');
    }

    async findUserChallengeParticipations(userId: string): Promise<ChallengeParticipation[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.challengeParticipationModel.find({ user: userId })
            .populate('user')
            .populate('challenge')
            .sort({ joinedAt: -1 });
    }

    async findChallengeParticipations(challengeId: string): Promise<ChallengeParticipation[]> {
        if(!isValidObjectId(challengeId)) {
            return [];
        }
        return this.challengeParticipationModel.find({ challenge: challengeId })
            .populate('user')
            .populate('challenge');
    }

    async updateChallengeParticipation(participationId: string, update: Partial<ChallengeParticipation>): Promise<ChallengeParticipation | null> {
        if(!isValidObjectId(participationId)) {
            return null;
        }
        return this.challengeParticipationModel.findByIdAndUpdate(participationId, update, { new: true })
            .populate('user')
            .populate('challenge');
    }

    async completeChallenge(participationId: string, finalScore: number): Promise<void> {
        if(!isValidObjectId(participationId)) {
            return;
        }
        await this.challengeParticipationModel.updateOne(
            { _id: participationId },
            { 
                isCompleted: true,
                completedAt: new Date(),
                progress: 100,
                finalScore
            }
        );
    }

    async getUserChallengeStats(userId: string): Promise<any> {
        if(!isValidObjectId(userId)) {
            return {};
        }

        const participations = await this.challengeParticipationModel.find({ user: userId });
        const completedChallenges = participations.filter(p => p.isCompleted).length;

        return {
            challengesCompleted: completedChallenges,
            challengesJoined: participations.length,
            completionRate: participations.length > 0 ? (completedChallenges / participations.length) * 100 : 0
        };
    }

    async deleteParticipation(participationId: string): Promise<void> {
        if(!isValidObjectId(participationId)) {
            return;
        }
        await this.challengeParticipationModel.deleteOne({ _id: participationId });
    }
}