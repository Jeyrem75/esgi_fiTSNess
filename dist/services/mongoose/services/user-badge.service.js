"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBadgeService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class UserBadgeService {
    constructor(connection) {
        this.connection = connection;
        this.userBadgeModel = connection.model('UserBadge', (0, schema_1.userBadgeSchema)());
    }
    awardBadge(userBadge) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userBadgeModel.create(userBadge);
        });
    }
    findUserBadges(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.userBadgeModel.find({ user: userId }).populate('badge');
        });
    }
    hasUserBadge(userId, badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId) || !(0, mongoose_1.isValidObjectId)(badgeId)) {
                return false;
            }
            const userBadge = yield this.userBadgeModel.findOne({ user: userId, badge: badgeId });
            return !!userBadge;
        });
    }
    removeUserBadge(userId, badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId) || !(0, mongoose_1.isValidObjectId)(badgeId)) {
                return;
            }
            yield this.userBadgeModel.deleteOne({ user: userId, badge: badgeId });
        });
    }
    checkAndAwardBadges(userId, userStats, activeBadges) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            const awardedBadges = [];
            for (const badge of activeBadges) {
                const alreadyHas = yield this.hasUserBadge(userId, badge._id);
                if (alreadyHas)
                    continue;
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
                    const userBadge = yield this.awardBadge({
                        user: userId,
                        badge: badge._id,
                        earnedAt: new Date()
                    });
                    awardedBadges.push(userBadge);
                }
            }
            return awardedBadges;
        });
    }
}
exports.UserBadgeService = UserBadgeService;
