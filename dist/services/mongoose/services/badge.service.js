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
exports.BadgeService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class BadgeService {
    constructor(connection) {
        this.connection = connection;
        this.badgeModel = connection.model('Badge', (0, schema_1.badgeSchema)());
    }
    createBadge(badge) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.badgeModel.create(badge);
        });
    }
    findBadges() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.badgeModel.find(filter);
        });
    }
    findBadgeById(badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(badgeId)) {
                return null;
            }
            return this.badgeModel.findById(badgeId);
        });
    }
    findActiveBadges() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.badgeModel.find({ isActive: true });
        });
    }
    findBadgesByRarity(rarity) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.badgeModel.find({ rarity, isActive: true });
        });
    }
    updateBadge(badgeId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(badgeId)) {
                return null;
            }
            return this.badgeModel.findByIdAndUpdate(badgeId, update, { new: true });
        });
    }
    deleteBadge(badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(badgeId)) {
                return;
            }
            yield this.badgeModel.deleteOne({ _id: badgeId });
        });
    }
    deactivateBadge(badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(badgeId)) {
                return;
            }
            yield this.badgeModel.updateOne({ _id: badgeId }, { isActive: false });
        });
    }
    reactivateBadge(badgeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(badgeId)) {
                return;
            }
            yield this.badgeModel.updateOne({ _id: badgeId }, { isActive: true });
        });
    }
}
exports.BadgeService = BadgeService;
