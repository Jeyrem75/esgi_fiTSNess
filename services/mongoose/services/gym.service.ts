import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import {Gym, GymStatus} from "../../../models";
import {gymSchema} from "../schema";

export type CreateGym = Omit<Gym, '_id' | 'createdAt' | 'updatedAt'>;

export class GymService {
    readonly gymModel: Model<Gym>;

    constructor(public readonly connection: Mongoose) {
        this.gymModel = connection.model('Gym', gymSchema());
    }

    async createGym(gym: CreateGym): Promise<Gym> {
        return this.gymModel.create(gym);
    }

    async findGyms(filter: FilterQuery<Gym> = {}): Promise<Gym[]> {
        return this.gymModel.find(filter).populate('owner');
    }

    async findGymById(gymId: string): Promise<Gym | null> {
        if(!isValidObjectId(gymId)) {
            return null;
        }
        return this.gymModel.findById(gymId).populate('owner');
    }

    async findGymsByOwner(ownerId: string): Promise<Gym[]> {
        if(!isValidObjectId(ownerId)) {
            return [];
        }
        return this.gymModel.find({ owner: ownerId }).populate('owner');
    }

    async approveGym(gymId: string): Promise<void> {
        if(!isValidObjectId(gymId)) {
            return;
        }
        await this.gymModel.updateOne({ _id: gymId }, { status: GymStatus.APPROVED });
    }

    async rejectGym(gymId: string): Promise<void> {
        if(!isValidObjectId(gymId)) {
            return;
        }
        await this.gymModel.updateOne({ _id: gymId }, { status: GymStatus.REJECTED });
    }

    async updateGym(gymId: string, update: Partial<CreateGym>): Promise<Gym | null> {
        if(!isValidObjectId(gymId)) {
            return null;
        }
        return this.gymModel.findByIdAndUpdate(gymId, update, { new: true }).populate('owner');
    }

    async deleteGym(gymId: string): Promise<void> {
        if(!isValidObjectId(gymId)) {
            return;
        }
        await this.gymModel.deleteOne({ _id: gymId });
    }

    async findApprovedGyms(): Promise<Gym[]> {
        return this.gymModel.find({ status: GymStatus.APPROVED }).populate('owner');
    }

    async findPendingGyms(): Promise<Gym[]> {
        return this.gymModel.find({ status: GymStatus.PENDING }).populate('owner');
    }

    async findRejectedGyms(): Promise<Gym[]> {
        return this.gymModel.find({ status: GymStatus.REJECTED }).populate('owner');
    }

    async findGymsByStatus(status: GymStatus): Promise<Gym[]> {
        return this.gymModel.find({ status }).populate('owner');
    }

    async searchGyms(query: string): Promise<Gym[]> {
        return this.gymModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { activities: { $in: [new RegExp(query, 'i')] } }
            ]
        }).populate('owner');
    }
}