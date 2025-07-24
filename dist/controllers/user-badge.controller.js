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
exports.UserBadgeController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class UserBadgeController {
    constructor(userBadgeService, badgeService, workoutService, challengeParticipationService, sessionService) {
        this.userBadgeService = userBadgeService;
        this.badgeService = badgeService;
        this.workoutService = workoutService;
        this.challengeParticipationService = challengeParticipationService;
        this.sessionService = sessionService;
    }
    getUserBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId || req.user._id;
            const userBadges = yield this.userBadgeService.findUserBadges(userId);
            res.json(userBadges);
        });
    }
    getMyBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userBadges = yield this.userBadgeService.findUserBadges(req.user._id);
            res.json(userBadges);
        });
    }
    checkBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const workoutStats = yield this.workoutService.getUserStats(req.user._id);
            const challengeStats = yield this.challengeParticipationService.getUserChallengeStats(req.user._id);
            const userStats = Object.assign(Object.assign({}, workoutStats), challengeStats);
            const activeBadges = yield this.badgeService.findActiveBadges();
            const awardedBadges = yield this.userBadgeService.checkAndAwardBadges(req.user._id, userStats, activeBadges);
            res.json(awardedBadges);
        });
    }
    awardBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.userId || !req.body.badgeId) {
                res.status(400).end();
                return;
            }
            try {
                const userBadge = yield this.userBadgeService.awardBadge({
                    user: req.body.userId,
                    badge: req.body.badgeId,
                    earnedAt: new Date()
                });
                res.status(201).json(userBadge);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    removeBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, badgeId } = req.params;
            yield this.userBadgeService.removeUserBadge(userId, badgeId);
            res.status(204).end();
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.get('/my', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMyBadges.bind(this));
        router.get('/check', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.checkBadges.bind(this));
        router.get('/user/:userId', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getUserBadges.bind(this));
        router.post('/award', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.awardBadge.bind(this));
        router.delete('/:userId/:badgeId', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.removeBadge.bind(this));
        return router;
    }
}
exports.UserBadgeController = UserBadgeController;
