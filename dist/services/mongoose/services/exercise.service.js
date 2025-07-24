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
exports.ExerciseService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class ExerciseService {
    constructor(connection) {
        this.connection = connection;
        this.exerciseModel = connection.model('Exercise', (0, schema_1.exerciseSchema)());
    }
    createExercise(exercise) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exerciseModel.create(exercise);
        });
    }
    findExercises() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.exerciseModel.find(filter);
        });
    }
    findExerciseById(exerciseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(exerciseId)) {
                return null;
            }
            return this.exerciseModel.findById(exerciseId);
        });
    }
    findExercisesByDifficulty(difficulty) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exerciseModel.find({ difficulty });
        });
    }
    findExercisesByMuscle(muscle) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exerciseModel.find({ targetedMuscles: { $in: [muscle] } });
        });
    }
    findExercisesByEquipment(equipment) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exerciseModel.find({ equipment: { $in: [equipment] } });
        });
    }
    updateExercise(exerciseId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(exerciseId)) {
                return null;
            }
            return this.exerciseModel.findByIdAndUpdate(exerciseId, update, { new: true });
        });
    }
    deleteExercise(exerciseId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(exerciseId)) {
                return;
            }
            yield this.exerciseModel.deleteOne({ _id: exerciseId });
        });
    }
    searchExercises(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exerciseModel.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { targetedMuscles: { $in: [new RegExp(query, 'i')] } }
                ]
            });
        });
    }
}
exports.ExerciseService = ExerciseService;
