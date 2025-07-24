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
exports.LeaderboardService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class LeaderboardService {
    constructor(connection) {
        this.connection = connection;
        this.leaderboardModel = connection.model('Leaderboard', (0, schema_1.leaderboardSchema)());
    }
    createLeaderboard(leaderboard) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.leaderboardModel.create(leaderboard);
        });
    }
    findLeaderboard(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return null;
            }
            return this.leaderboardModel.findOne({ challenge: challengeId })
                .populate('challenge')
                .populate('rankings.user');
        });
    }
    updateLeaderboard(challengeId, rankings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return null;
            }
            return this.leaderboardModel.findOneAndUpdate({ challenge: challengeId }, {
                rankings,
                lastUpdated: new Date()
            }, { new: true, upsert: true }).populate('challenge').populate('rankings.user');
        });
    }
    findUserLeaderboards(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.leaderboardModel.find({
                'rankings.user': userId
            }).populate('challenge').populate('rankings.user');
        });
    }
    deleteLeaderboard(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return;
            }
            yield this.leaderboardModel.deleteOne({ challenge: challengeId });
        });
    }
}
exports.LeaderboardService = LeaderboardService;
