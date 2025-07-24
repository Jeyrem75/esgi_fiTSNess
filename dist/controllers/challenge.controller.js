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
exports.ChallengeController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class ChallengeController {
    constructor(challengeService, sessionService) {
        this.challengeService = challengeService;
        this.sessionService = sessionService;
    }
    createChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.title || !req.body.description || !req.body.exercises ||
                !req.body.duration || !req.body.difficulty || !req.body.objectives ||
                !req.body.rules || !req.body.startDate || !req.body.endDate || !req.body.category) {
                res.status(400).end();
                return;
            }
            try {
                let rewards = req.body.rewards || [];
                if (req.user.role === models_1.UserRole.USER) {
                    rewards = [];
                }
                const challenge = yield this.challengeService.createChallenge({
                    title: req.body.title,
                    description: req.body.description,
                    exercises: req.body.exercises,
                    duration: req.body.duration,
                    difficulty: req.body.difficulty,
                    objectives: req.body.objectives,
                    rules: req.body.rules,
                    startDate: new Date(req.body.startDate),
                    endDate: new Date(req.body.endDate),
                    maxParticipants: req.body.maxParticipants,
                    rewards: rewards,
                    creator: req.user._id,
                    gym: req.body.gym,
                    isActive: true,
                    category: req.body.category
                });
                res.status(201).json(challenge);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    getChallenges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category, difficulty, gym, active, search } = req.query;
            let challenges;
            if (search) {
                challenges = yield this.challengeService.searchChallenges(search);
            }
            else if (category) {
                challenges = yield this.challengeService.findChallengesByCategory(category);
            }
            else if (difficulty) {
                challenges = yield this.challengeService.findChallengesByDifficulty(difficulty);
            }
            else if (gym) {
                challenges = yield this.challengeService.findChallengesByGym(gym);
            }
            else if (active === 'true') {
                challenges = yield this.challengeService.findActiveChallenges();
            }
            else {
                challenges = yield this.challengeService.findChallenges();
            }
            res.json(challenges);
        });
    }
    getChallengeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.challengeService.findChallengeById(req.params.id);
            if (!challenge) {
                res.status(404).end();
                return;
            }
            res.json(challenge);
        });
    }
    getMyChallenges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenges = yield this.challengeService.findChallengesByCreator(req.user._id);
            res.json(challenges);
        });
    }
    updateChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.challengeService.findChallengeById(req.params.id);
            if (!challenge) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user._id) {
                res.status(403).end();
                return;
            }
            const updatedChallenge = yield this.challengeService.updateChallenge(req.params.id, req.body);
            res.json(updatedChallenge);
        });
    }
    deleteChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.challengeService.findChallengeById(req.params.id);
            if (!challenge) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user._id) {
                res.status(403).end();
                return;
            }
            yield this.challengeService.deleteChallenge(req.params.id);
            res.status(204).end();
        });
    }
    deactivateChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.challengeService.findChallengeById(req.params.id);
            if (!challenge) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user._id) {
                res.status(403).end();
                return;
            }
            yield this.challengeService.deactivateChallenge(req.params.id);
            res.status(204).end();
        });
    }
    reactivateChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challenge = yield this.challengeService.findChallengeById(req.params.id);
            if (!challenge) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user._id) {
                res.status(403).end();
                return;
            }
            yield this.challengeService.reactivateChallenge(req.params.id);
            res.status(204).end();
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.createChallenge.bind(this));
        router.get('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getChallenges.bind(this));
        router.get('/my', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMyChallenges.bind(this));
        router.get('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getChallengeById.bind(this));
        router.put('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.updateChallenge.bind(this));
        router.delete('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.deleteChallenge.bind(this));
        router.patch('/:id/deactivate', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.deactivateChallenge.bind(this));
        router.patch('/:id/reactivate', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.reactivateChallenge.bind(this));
        return router;
    }
}
exports.ChallengeController = ChallengeController;
