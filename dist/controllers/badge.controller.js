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
exports.BadgeController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class BadgeController {
    constructor(badgeService, sessionService) {
        this.badgeService = badgeService;
        this.sessionService = sessionService;
    }
    createBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.name || !req.body.description || !req.body.rules || !req.body.rarity) {
                res.status(400).end();
                return;
            }
            try {
                const badge = yield this.badgeService.createBadge({
                    name: req.body.name,
                    description: req.body.description,
                    imageUrl: req.body.imageUrl,
                    rules: req.body.rules,
                    isActive: true,
                    rarity: req.body.rarity
                });
                res.status(201).json(badge);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    getBadges(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rarity, active } = req.query;
            let badges;
            if (rarity) {
                badges = yield this.badgeService.findBadgesByRarity(rarity);
            }
            else if (active === 'true') {
                badges = yield this.badgeService.findActiveBadges();
            }
            else {
                badges = yield this.badgeService.findBadges();
            }
            res.json(badges);
        });
    }
    getBadgeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const badge = yield this.badgeService.findBadgeById(req.params.id);
            if (!badge) {
                res.status(404).end();
                return;
            }
            res.json(badge);
        });
    }
    updateBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const badge = yield this.badgeService.updateBadge(req.params.id, req.body);
            if (!badge) {
                res.status(404).end();
                return;
            }
            res.json(badge);
        });
    }
    deleteBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.badgeService.deleteBadge(req.params.id);
            res.status(204).end();
        });
    }
    deactivateBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.badgeService.deactivateBadge(req.params.id);
            res.status(204).end();
        });
    }
    reactivateBadge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.badgeService.reactivateBadge(req.params.id);
            res.status(204).end();
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.createBadge.bind(this));
        router.get('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getBadges.bind(this));
        router.get('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getBadgeById.bind(this));
        router.put('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.updateBadge.bind(this));
        router.delete('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.deleteBadge.bind(this));
        router.patch('/:id/deactivate', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.deactivateBadge.bind(this));
        router.patch('/:id/reactivate', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.reactivateBadge.bind(this));
        return router;
    }
}
exports.BadgeController = BadgeController;
