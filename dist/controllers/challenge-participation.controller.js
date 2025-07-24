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
exports.ChallengeParticipationController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class ChallengeParticipationController {
    constructor(challengeParticipationService, challengeService, userBadgeService, badgeService, workoutService, sessionService) {
        this.challengeParticipationService = challengeParticipationService;
        this.challengeService = challengeService;
        this.userBadgeService = userBadgeService;
        this.badgeService = badgeService;
        this.workoutService = workoutService;
        this.sessionService = sessionService;
    }
    joinChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.challengeService.findChallengeById(req.params.challengeId);
            if (!challenge) {
                res.status(404).end();
                return;
            }
            const existingParticipation = yield this.challengeParticipationService.findChallengeParticipation(req.user._id, req.params.challengeId);
            if (existingParticipation) {
                res.status(409).end();
                return;
            }
            const now = new Date();
            if (challenge.startDate > now || challenge.endDate < now || !challenge.isActive) {
                res.status(400).end();
                return;
            }
            try {
                const participation = yield this.challengeParticipationService.joinChallenge({
                    user: req.user._id,
                    challenge: req.params.challengeId,
                    joinedAt: new Date(),
                    progress: 0,
                    workoutSessions: [],
                    isCompleted: false
                });
                res.status(201).json(participation);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    getMyChallengeParticipations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const participations = yield this.challengeParticipationService.findUserChallengeParticipations(req.user._id);
            res.json(participations);
        });
    }
    getChallengeParticipations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const participations = yield this.challengeParticipationService.findChallengeParticipations(req.params.challengeId);
            res.json(participations);
        });
    }
    updateParticipation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const participation = yield this.challengeParticipationService.updateChallengeParticipation(req.params.id, req.body);
            if (!participation) {
                res.status(404).end();
                return;
            }
            res.json(participation);
        });
    }
    completeChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const participation = yield this.challengeParticipationService.findChallengeParticipation(req.user._id, req.params.challengeId);
            if (!participation) {
                res.status(404).end();
                return;
            }
            if (participation.isCompleted) {
                res.status(400).end();
                return;
            }
            const finalScore = req.body.finalScore || 100;
            yield this.challengeParticipationService.completeChallenge(participation._id, finalScore);
            const workoutStats = yield this.workoutService.getUserStats(req.user._id);
            const challengeStats = yield this.challengeParticipationService.getUserChallengeStats(req.user._id);
            const userStats = Object.assign(Object.assign({}, workoutStats), challengeStats);
            const activeBadges = yield this.badgeService.findActiveBadges();
            yield this.userBadgeService.checkAndAwardBadges(req.user._id, userStats, activeBadges);
            res.status(204).end();
        });
    }
    leaveChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const participation = yield this.challengeParticipationService.findChallengeParticipation(req.user._id, req.params.challengeId);
            if (!participation) {
                res.status(404).end();
                return;
            }
            if (participation.isCompleted) {
                res.status(400).end();
                return;
            }
            yield this.challengeParticipationService.deleteParticipation(participation._id);
            res.status(204).end();
        });
    }
    addWorkoutToChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.workoutSessionId) {
                res.status(400).end();
                return;
            }
            const participation = yield this.challengeParticipationService.findChallengeParticipation(req.user._id, req.params.challengeId);
            if (!participation) {
                res.status(404).end();
                return;
            }
            const updatedSessions = [...participation.workoutSessions, req.body.workoutSessionId];
            const newProgress = Math.min(100, participation.progress + 10);
            const updatedParticipation = yield this.challengeParticipationService.updateChallengeParticipation(participation._id, {
                workoutSessions: updatedSessions,
                progress: newProgress
            });
            res.json(updatedParticipation);
        });
    }
    getChallengeStats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId || req.user._id;
            const stats = yield this.challengeParticipationService.getUserChallengeStats(userId);
            res.json(stats);
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/challenge/:challengeId/join', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.joinChallenge.bind(this));
        router.get('/my', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMyChallengeParticipations.bind(this));
        router.get('/challenge/:challengeId', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getChallengeParticipations.bind(this));
        router.put('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.updateParticipation.bind(this));
        router.post('/challenge/:challengeId/complete', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.completeChallenge.bind(this));
        router.delete('/challenge/:challengeId/leave', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.leaveChallenge.bind(this));
        router.post('/challenge/:challengeId/workout', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.addWorkoutToChallenge.bind(this));
        router.get('/stats/:userId', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getChallengeStats.bind(this));
        return router;
    }
}
exports.ChallengeParticipationController = ChallengeParticipationController;
