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
exports.ChallengeParticipationService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class ChallengeParticipationService {
    constructor(connection) {
        this.connection = connection;
        this.challengeParticipationModel = connection.model('ChallengeParticipation', (0, schema_1.challengeParticipationSchema)());
    }
    joinChallenge(participation) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.challengeParticipationModel.create(participation);
        });
    }
    findChallengeParticipation(userId, challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId) || !(0, mongoose_1.isValidObjectId)(challengeId)) {
                return null;
            }
            return this.challengeParticipationModel.findOne({ user: userId, challenge: challengeId })
                .populate('user')
                .populate('challenge');
        });
    }
    findUserChallengeParticipations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.challengeParticipationModel.find({ user: userId })
                .populate('user')
                .populate('challenge')
                .sort({ joinedAt: -1 });
        });
    }
    findChallengeParticipations(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return [];
            }
            return this.challengeParticipationModel.find({ challenge: challengeId })
                .populate('user')
                .populate('challenge');
        });
    }
    updateChallengeParticipation(participationId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(participationId)) {
                return null;
            }
            return this.challengeParticipationModel.findByIdAndUpdate(participationId, update, { new: true })
                .populate('user')
                .populate('challenge');
        });
    }
    completeChallenge(participationId, finalScore) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(participationId)) {
                return;
            }
            yield this.challengeParticipationModel.updateOne({ _id: participationId }, {
                isCompleted: true,
                completedAt: new Date(),
                progress: 100,
                finalScore
            });
        });
    }
    getUserChallengeStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return {};
            }
            const participations = yield this.challengeParticipationModel.find({ user: userId });
            const completedChallenges = participations.filter(p => p.isCompleted).length;
            return {
                challengesCompleted: completedChallenges,
                challengesJoined: participations.length,
                completionRate: participations.length > 0 ? (completedChallenges / participations.length) * 100 : 0
            };
        });
    }
    deleteParticipation(participationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(participationId)) {
                return;
            }
            yield this.challengeParticipationModel.deleteOne({ _id: participationId });
        });
    }
}
exports.ChallengeParticipationService = ChallengeParticipationService;
