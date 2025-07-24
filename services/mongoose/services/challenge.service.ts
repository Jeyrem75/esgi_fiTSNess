import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import {Challenge, ChallengeDifficulty, ChallengeCategory} from "../../../models";
import {challengeSchema} from "../schema";

export type CreateChallenge = Omit<Challenge, '_id' | 'createdAt' | 'updatedAt'>;

export class ChallengeService {
    readonly challengeModel: Model<Challenge>;

    constructor(public readonly connection: Mongoose) {
        this.challengeModel = connection.model('Challenge', challengeSchema());
    }

    async createChallenge(challenge: CreateChallenge): Promise<Challenge> {
        return this.challengeModel.create(challenge);
    }

    async findChallenges(filter: FilterQuery<Challenge> = {}): Promise<Challenge[]> {
        return this.challengeModel.find(filter)
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findChallengeById(challengeId: string): Promise<Challenge | null> {
        if(!isValidObjectId(challengeId)) {
            return null;
        }
        return this.challengeModel.findById(challengeId)
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findChallengesByCreator(creatorId: string): Promise<Challenge[]> {
        if(!isValidObjectId(creatorId)) {
            return [];
        }
        return this.challengeModel.find({ creator: creatorId })
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findChallengesByGym(gymId: string): Promise<Challenge[]> {
        if(!isValidObjectId(gymId)) {
            return [];
        }
        return this.challengeModel.find({ gym: gymId })
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findActiveChallenges(): Promise<Challenge[]> {
        const now = new Date();
        return this.challengeModel.find({
            isActive: true
        })
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findChallengesByCategory(category: ChallengeCategory): Promise<Challenge[]> {
        return this.challengeModel.find({ category, isActive: true })
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findChallengesByDifficulty(difficulty: ChallengeDifficulty): Promise<Challenge[]> {
        return this.challengeModel.find({ difficulty, isActive: true })
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async updateChallenge(challengeId: string, update: Partial<CreateChallenge>): Promise<Challenge | null> {
        if(!isValidObjectId(challengeId)) {
            return null;
        }
        return this.challengeModel.findByIdAndUpdate(challengeId, update, { new: true })
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async deleteChallenge(challengeId: string): Promise<void> {
        if(!isValidObjectId(challengeId)) {
            return;
        }
        await this.challengeModel.deleteOne({ _id: challengeId });
    }

    async deactivateChallenge(challengeId: string): Promise<void> {
        if(!isValidObjectId(challengeId)) {
            return;
        }
        await this.challengeModel.updateOne({ _id: challengeId }, { isActive: false });
    }

    async reactivateChallenge(challengeId: string): Promise<void> {
        if(!isValidObjectId(challengeId)) {
            return;
        }
        await this.challengeModel.updateOne({ _id: challengeId }, { isActive: true });
    }

    async searchChallenges(query: string): Promise<Challenge[]> {
        return this.challengeModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { objectives: { $in: [new RegExp(query, 'i')] } }
            ],
            isActive: true
        })
            .populate('creator')
            .populate('gym')
            .populate('exercises.exercise');
    }
}