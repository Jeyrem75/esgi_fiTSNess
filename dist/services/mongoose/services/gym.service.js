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
exports.GymService = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
const schema_1 = require("../schema");
class GymService {
    constructor(connection) {
        this.connection = connection;
        this.gymModel = connection.model('Gym', (0, schema_1.gymSchema)());
    }
    createGym(gym) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gymModel.create(gym);
        });
    }
    findGyms() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.gymModel.find(filter).populate('owner');
        });
    }
    findGymById(gymId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(gymId)) {
                return null;
            }
            return this.gymModel.findById(gymId).populate('owner');
        });
    }
    findGymsByOwner(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(ownerId)) {
                return [];
            }
            return this.gymModel.find({ owner: ownerId }).populate('owner');
        });
    }
    approveGym(gymId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(gymId)) {
                return;
            }
            yield this.gymModel.updateOne({ _id: gymId }, { status: models_1.GymStatus.APPROVED });
        });
    }
    rejectGym(gymId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(gymId)) {
                return;
            }
            yield this.gymModel.updateOne({ _id: gymId }, { status: models_1.GymStatus.REJECTED });
        });
    }
    updateGym(gymId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(gymId)) {
                return null;
            }
            return this.gymModel.findByIdAndUpdate(gymId, update, { new: true }).populate('owner');
        });
    }
    deleteGym(gymId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(gymId)) {
                return;
            }
            yield this.gymModel.deleteOne({ _id: gymId });
        });
    }
    findApprovedGyms() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gymModel.find({ status: models_1.GymStatus.APPROVED }).populate('owner');
        });
    }
    findPendingGyms() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gymModel.find({ status: models_1.GymStatus.PENDING }).populate('owner');
        });
    }
    findRejectedGyms() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gymModel.find({ status: models_1.GymStatus.REJECTED }).populate('owner');
        });
    }
    findGymsByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gymModel.find({ status }).populate('owner');
        });
    }
    searchGyms(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gymModel.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { activities: { $in: [new RegExp(query, 'i')] } }
                ]
            }).populate('owner');
        });
    }
}
exports.GymService = GymService;
