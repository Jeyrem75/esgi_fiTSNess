import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import {Badge, BadgeRarity} from "../../../models";
import {badgeSchema} from "../schema";

export type CreateBadge = Omit<Badge, '_id' | 'createdAt' | 'updatedAt'>;

export class BadgeService {
    readonly badgeModel: Model<Badge>;

    constructor(public readonly connection: Mongoose) {
        this.badgeModel = connection.model('Badge', badgeSchema());
    }

    async createBadge(badge: CreateBadge): Promise<Badge> {
        return this.badgeModel.create(badge);
    }

    async findBadges(filter: FilterQuery<Badge> = {}): Promise<Badge[]> {
        return this.badgeModel.find(filter);
    }

    async findBadgeById(badgeId: string): Promise<Badge | null> {
        if(!isValidObjectId(badgeId)) {
            return null;
        }
        return this.badgeModel.findById(badgeId);
    }

    async findActiveBadges(): Promise<Badge[]> {
        return this.badgeModel.find({ isActive: true });
    }

    async findBadgesByRarity(rarity: BadgeRarity): Promise<Badge[]> {
        return this.badgeModel.find({ rarity, isActive: true });
    }

    async updateBadge(badgeId: string, update: Partial<CreateBadge>): Promise<Badge | null> {
        if(!isValidObjectId(badgeId)) {
            return null;
        }
        return this.badgeModel.findByIdAndUpdate(badgeId, update, { new: true });
    }

    async deleteBadge(badgeId: string): Promise<void> {
        if(!isValidObjectId(badgeId)) {
            return;
        }
        await this.badgeModel.deleteOne({ _id: badgeId });
    }

    async deactivateBadge(badgeId: string): Promise<void> {
        if(!isValidObjectId(badgeId)) {
            return;
        }
        await this.badgeModel.updateOne({ _id: badgeId }, { isActive: false });
    }

    async reactivateBadge(badgeId: string): Promise<void> {
        if(!isValidObjectId(badgeId)) {
            return;
        }
        await this.badgeModel.updateOne({ _id: badgeId }, { isActive: true });
    }
}