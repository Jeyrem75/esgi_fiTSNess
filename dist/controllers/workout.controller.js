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
exports.WorkoutController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class WorkoutController {
    constructor(workoutService, sessionService) {
        this.workoutService = workoutService;
        this.sessionService = sessionService;
    }
    createWorkoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.exercises || !req.body.duration) {
                res.status(400).end();
                return;
            }
            try {
                const session = yield this.workoutService.createWorkoutSession({
                    user: req.user._id,
                    challenge: req.body.challenge,
                    gym: req.body.gym,
                    exercises: req.body.exercises,
                    duration: req.body.duration,
                    caloriesBurned: req.body.caloriesBurned,
                    notes: req.body.notes,
                    sessionDate: req.body.sessionDate ? new Date(req.body.sessionDate) : new Date()
                });
                res.status(201).json(session);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    getWorkoutSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user, challenge } = req.query;
            let sessions;
            if (user) {
                sessions = yield this.workoutService.findUserWorkoutSessions(user);
            }
            else if (challenge) {
                sessions = yield this.workoutService.findChallengeWorkoutSessions(challenge);
            }
            else {
                sessions = yield this.workoutService.findWorkoutSessions();
            }
            res.json(sessions);
        });
    }
    getMyWorkoutSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessions = yield this.workoutService.findUserWorkoutSessions(req.user._id);
            res.json(sessions);
        });
    }
    getWorkoutSessionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.workoutService.findWorkoutSessionById(req.params.id);
            if (!session) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && session.user.toString() !== req.user._id) {
                res.status(403).end();
                return;
            }
            res.json(session);
        });
    }
    updateWorkoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.workoutService.findWorkoutSessionById(req.params.id);
            if (!session) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && session.user.toString() !== req.user._id) {
                res.status(403).end();
                return;
            }
            const updatedSession = yield this.workoutService.updateWorkoutSession(req.params.id, req.body);
            res.json(updatedSession);
        });
    }
    deleteWorkoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.workoutService.findWorkoutSessionById(req.params.id);
            if (!session) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && session.user.toString() !== req.user._id) {
                res.status(403).end();
                return;
            }
            yield this.workoutService.deleteWorkoutSession(req.params.id);
            res.status(204).end();
        });
    }
    getUserStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId || req.user._id;
            const stats = yield this.workoutService.getUserStats(userId);
            res.json(stats);
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.createWorkoutSession.bind(this));
        router.get('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getWorkoutSessions.bind(this));
        router.get('/my', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMyWorkoutSessions.bind(this));
        router.get('/stats', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getUserStats.bind(this));
        router.get('/stats/:userId', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getUserStats.bind(this));
        router.get('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getWorkoutSessionById.bind(this));
        router.put('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.updateWorkoutSession.bind(this));
        router.delete('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.deleteWorkoutSession.bind(this));
        return router;
    }
}
exports.WorkoutController = WorkoutController;
