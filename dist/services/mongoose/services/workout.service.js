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
exports.WorkoutService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class WorkoutService {
    constructor(connection) {
        this.connection = connection;
        this.workoutSessionModel = connection.model('WorkoutSession', (0, schema_1.workoutSessionSchema)());
    }
    createWorkoutSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.workoutSessionModel.create(session);
        });
    }
    findWorkoutSessions() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.workoutSessionModel.find(filter)
                .populate('user')
                .populate('challenge')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findWorkoutSessionById(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(sessionId)) {
                return null;
            }
            return this.workoutSessionModel.findById(sessionId)
                .populate('user')
                .populate('challenge')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    findUserWorkoutSessions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.workoutSessionModel.find({ user: userId })
                .populate('user')
                .populate('challenge')
                .populate('gym')
                .populate('exercises.exercise')
                .sort({ sessionDate: -1 });
        });
    }
    findChallengeWorkoutSessions(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return [];
            }
            return this.workoutSessionModel.find({ challenge: challengeId })
                .populate('user')
                .populate('challenge')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    updateWorkoutSession(sessionId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(sessionId)) {
                return null;
            }
            return this.workoutSessionModel.findByIdAndUpdate(sessionId, update, { new: true })
                .populate('user')
                .populate('challenge')
                .populate('gym')
                .populate('exercises.exercise');
        });
    }
    deleteWorkoutSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(sessionId)) {
                return;
            }
            yield this.workoutSessionModel.deleteOne({ _id: sessionId });
        });
    }
    getUserStats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return {};
            }
            const workoutSessions = yield this.workoutSessionModel.find({ user: userId });
            const totalWorkouts = workoutSessions.length;
            const totalCaloriesBurned = workoutSessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0);
            const uniqueDays = new Set(workoutSessions.map(session => session.sessionDate.toISOString().split('T')[0])).size;
            const uniqueGyms = new Set(workoutSessions
                .filter(session => session.gym)
                .map(session => { var _a; return (_a = session.gym) === null || _a === void 0 ? void 0 : _a.toString(); })).size;
            return {
                workoutsCompleted: totalWorkouts,
                caloriesBurned: totalCaloriesBurned,
                daysActive: uniqueDays,
                gymsVisited: uniqueGyms
            };
        });
    }
}
exports.WorkoutService = WorkoutService;
