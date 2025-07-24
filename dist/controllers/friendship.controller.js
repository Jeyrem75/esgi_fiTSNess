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
exports.FriendshipController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class FriendshipController {
    constructor(friendshipService, sessionService) {
        this.friendshipService = friendshipService;
        this.sessionService = sessionService;
    }
    sendFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.addresseeId) {
                res.status(400).end();
                return;
            }
            if (req.body.addresseeId === req.user._id) {
                res.status(400).end();
                return;
            }
            try {
                const friendship = yield this.friendshipService.sendFriendRequest(req.user._id, req.body.addresseeId);
                res.status(201).json(friendship);
            }
            catch (_a) {
                res.status(409).end();
            }
        });
    }
    acceptFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.friendshipService.acceptFriendRequest(req.params.id);
            res.status(204).end();
        });
    }
    declineFriendRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.friendshipService.declineFriendRequest(req.params.id);
            res.status(204).end();
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.friendshipService.blockUser(req.params.id);
            res.status(204).end();
        });
    }
    removeFriend(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.friendId) {
                res.status(400).end();
                return;
            }
            yield this.friendshipService.removeFriend(req.user._id, req.body.friendId);
            res.status(204).end();
        });
    }
    getMyFriends(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const friends = yield this.friendshipService.findUserFriends(req.user._id);
            res.json(friends);
        });
    }
    getPendingRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield this.friendshipService.findPendingRequests(req.user._id);
            res.json(requests);
        });
    }
    getSentRequests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const requests = yield this.friendshipService.findSentRequests(req.user._id);
            res.json(requests);
        });
    }
    checkFriendship(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const areFriends = yield this.friendshipService.areFriends(req.user._id, userId);
            res.json({ areFriends });
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/request', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.sendFriendRequest.bind(this));
        router.patch('/:id/accept', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.acceptFriendRequest.bind(this));
        router.patch('/:id/decline', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.declineFriendRequest.bind(this));
        router.patch('/:id/block', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.blockUser.bind(this));
        router.delete('/remove', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.removeFriend.bind(this));
        router.get('/my', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMyFriends.bind(this));
        router.get('/requests/pending', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getPendingRequests.bind(this));
        router.get('/requests/sent', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getSentRequests.bind(this));
        router.get('/check/:userId', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.checkFriendship.bind(this));
        return router;
    }
}
exports.FriendshipController = FriendshipController;
