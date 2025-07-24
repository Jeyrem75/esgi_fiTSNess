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
exports.LeaderboardController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class LeaderboardController {
    constructor(leaderboardService, challengeParticipationService, sessionService) {
        this.leaderboardService = leaderboardService;
        this.challengeParticipationService = challengeParticipationService;
        this.sessionService = sessionService;
    }
    getChallengeLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const leaderboard = yield this.leaderboardService.findLeaderboard(req.params.challengeId);
            if (!leaderboard) {
                const participations = yield this.challengeParticipationService.findChallengeParticipations(req.params.challengeId);
                const rankings = participations
                    .filter(p => p.isCompleted)
                    .map((p, index) => ({
                    user: p.user,
                    score: p.finalScore || 0,
                    position: index + 1,
                    completedAt: p.completedAt
                }))
                    .sort((a, b) => b.score - a.score)
                    .map((entry, index) => (Object.assign(Object.assign({}, entry), { position: index + 1 })));
                const newLeaderboard = yield this.leaderboardService.updateLeaderboard(req.params.challengeId, rankings);
                res.json(newLeaderboard);
            }
            else {
                res.json(leaderboard);
            }
        });
    }
    getMyLeaderboards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const leaderboards = yield this.leaderboardService.findUserLeaderboards(req.user._id);
            res.json(leaderboards);
        });
    }
    updateLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.rankings) {
                res.status(400).end();
                return;
            }
            const leaderboard = yield this.leaderboardService.updateLeaderboard(req.params.challengeId, req.body.rankings);
            res.json(leaderboard);
        });
    }
    createLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.challengeId || !req.body.rankings) {
                res.status(400).end();
                return;
            }
            try {
                const leaderboard = yield this.leaderboardService.createLeaderboard({
                    challenge: req.body.challengeId,
                    rankings: req.body.rankings,
                    lastUpdated: new Date()
                });
                res.status(201).json(leaderboard);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    deleteLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.leaderboardService.deleteLeaderboard(req.params.challengeId);
            res.status(204).end();
        });
    }
    refreshLeaderboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const participations = yield this.challengeParticipationService.findChallengeParticipations(req.params.challengeId);
            const rankings = participations
                .filter((p) => p.isCompleted)
                .map((p, index) => ({
                user: p.user,
                score: p.finalScore || 0,
                position: index + 1,
                completedAt: p.completedAt
            }))
                .sort((a, b) => b.score - a.score)
                .map((entry, index) => (Object.assign(Object.assign({}, entry), { position: index + 1 })));
            const leaderboard = yield this.leaderboardService.updateLeaderboard(req.params.challengeId, rankings);
            res.json(leaderboard);
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.get('/challenge/:challengeId', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getChallengeLeaderboard.bind(this));
        router.get('/my', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMyLeaderboards.bind(this));
        router.post('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.createLeaderboard.bind(this));
        router.put('/challenge/:challengeId', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.updateLeaderboard.bind(this));
        router.delete('/challenge/:challengeId', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.deleteLeaderboard.bind(this));
        router.post('/challenge/:challengeId/refresh', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.refreshLeaderboard.bind(this));
        return router;
    }
}
exports.LeaderboardController = LeaderboardController;
