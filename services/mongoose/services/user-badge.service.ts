import {Mongoose, Model, isValidObjectId} from "mongoose";
import {UserBadge, Badge} from "../../../models";
import {userBadgeSchema} from "../schema";

export type CreateUserBadge = Omit<UserBadge, '_id' | 'createdAt' | 'updatedAt'>;

export class UserBadgeService {
    readonly userBadgeModel: Model<UserBadge>;

    constructor(public readonly connection: Mongoose) {
        this.userBadgeModel = connection.model('UserBadge', userBadgeSchema());
    }

    async awardBadge(userBadge: CreateUserBadge): Promise<UserBadge> {
        return this.userBadgeModel.create(userBadge);
    }

    async findUserBadges(userId: string): Promise<UserBadge[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.userBadgeModel.find({ user: userId }).populate('badge');
    }

    async hasUserBadge(userId: string, badgeId: string): Promise<boolean> {
        if(!isValidObjectId(userId) || !isValidObjectId(badgeId)) {
            return false;
        }
        const userBadge = await this.userBadgeModel.findOne({ user: userId, badge: badgeId });
        return !!userBadge;
    }

    async removeUserBadge(userId: string, badgeId: string): Promise<void> {
        if(!isValidObjectId(userId) || !isValidObjectId(badgeId)) {
            return;
        }
        await this.userBadgeModel.deleteOne({ user: userId, badge: badgeId });
    }

    async checkAndAwardBadges(userId: string, userStats: any, activeBadges: Badge[]): Promise<UserBadge[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        
        const awardedBadges: UserBadge[] = [];

        for (const badge of activeBadges) {
            const alreadyHas = await this.hasUserBadge(userId, badge._id);
            if (alreadyHas) continue;

            let shouldAward = true;
            for (const rule of badge.rules) {
                const userValue = userStats[rule.field] || 0;
                let conditionMet = false;

                switch (rule.operator) {
                    case 'GREATER_THAN':
                        conditionMet = userValue > rule.value;
                        break;
                    case 'GREATER_THAN_OR_EQUAL':
                        conditionMet = userValue >= rule.value;
                        break;
                    case 'EQUAL':
                        conditionMet = userValue === rule.value;
                        break;
                    case 'LESS_THAN':
                        conditionMet = userValue < rule.value;
                        break;
                    case 'LESS_THAN_OR_EQUAL':
                        conditionMet = userValue <= rule.value;
                        break;
                }

                if (!conditionMet) {
                    shouldAward = false;
                    break;
                }
            }

            if (shouldAward) {
                const userBadge = await this.awardBadge({
                    user: userId,
                    badge: badge._id,
                    earnedAt: new Date()
                });
                awardedBadges.push(userBadge);
            }
        }

        return awardedBadges;
    }
}