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
exports.ChallengeService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class ChallengeService {
    constructor(connection) {
        this.connection = connection;
        this.challengeModel = connection.model('Challenge', (0, schema_1.challengeSchema)());
    }
    createChallenge(challenge) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.challengeModel.create(challenge);
        });
    }
    findChallenges() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.challengeModel.find(filter)
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findChallengeById(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return null;
            }
            return this.challengeModel.findById(challengeId)
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findChallengesByCreator(creatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(creatorId)) {
                return [];
            }
            return this.challengeModel.find({ creator: creatorId })
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findChallengesByGym(gymId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(gymId)) {
                return [];
            }
            return this.challengeModel.find({ gym: gymId })
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findActiveChallenges() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            return this.challengeModel.find({
                isActive: true
            })
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findChallengesByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.challengeModel.find({ category, isActive: true })
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findChallengesByDifficulty(difficulty) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.challengeModel.find({ difficulty, isActive: true })
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    updateChallenge(challengeId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return null;
            }
            return this.challengeModel.findByIdAndUpdate(challengeId, update, { new: true })
                .populate('creator')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    deleteChallenge(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return;
            }
            yield this.challengeModel.deleteOne({ _id: challengeId });
        });
    }
    deactivateChallenge(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return;
            }
            yield this.challengeModel.updateOne({ _id: challengeId }, { isActive: false });
        });
    }
    reactivateChallenge(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return;
            }
            yield this.challengeModel.updateOne({ _id: challengeId }, { isActive: true });
        });
    }
    searchChallenges(query) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.ChallengeService = ChallengeService;
