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
exports.UserController = void 0;
const user_interface_1 = require("./../models/user.interface");
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class UserController {
    constructor(userService, sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.email || !req.body.password
                || !req.body.lastName || !req.body.firstName || !req.body.role) {
                res.status(400).end();
                return;
            }
            try {
                const user = yield this.userService.createUser({
                    email: req.body.email,
                    role: req.body.role,
                    password: req.body.password,
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    isActive: true,
                    profileImage: req.body.profileImage,
                    dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
                    height: req.body.height,
                    weight: req.body.weight,
                    fitnessLevel: req.body.fitnessLevel,
                    goals: req.body.goals || [],
                    totalScore: 0,
                    preferences: {
                        notifications: {
                            challengeInvites: true,
                            friendRequests: true,
                            achievements: true,
                            workoutReminders: true,
                            challengeUpdates: true
                        },
                        privacy: {
                            profileVisibility: models_1.ProfileVisibility.PUBLIC,
                            workoutVisibility: models_1.WorkoutVisibility.FRIENDS_ONLY,
                            friendsListVisibility: models_1.FriendsListVisibility.FRIENDS_ONLY
                        },
                        units: {
                            weight: user_interface_1.WeightUnit.KG,
                            distance: user_interface_1.DistanceUnit.KM,
                            temperature: user_interface_1.TemperatureUnit.CELSIUS
                        }
                    }
                });
                res.status(201).json(user);
            }
            catch (_a) {
                res.status(409).end();
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role, active } = req.query;
            let filter = {};
            if (role)
                filter.role = role;
            if (active !== undefined)
                filter.isActive = active === 'true';
            const users = yield this.userService.findUsers(filter);
            res.json(users);
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findUserById(req.params.id);
            if (!user) {
                res.status(404).end();
                return;
            }
            res.json(user);
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && userId !== req.user._id) {
                res.status(403).end();
                return;
            }
            const user = yield this.userService.updateUser(userId, req.body);
            if (!user) {
                res.status(404).end();
                return;
            }
            res.json(user);
        });
    }
    updateMyProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.updateUser(req.user._id, req.body);
            res.json(user);
        });
    }
    promoteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            yield this.userService.updateRole(userId, models_1.UserRole.GYM_OWNER);
            res.status(204).end();
        });
    }
    demoteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            yield this.userService.updateRole(userId, models_1.UserRole.USER);
            res.status(204).end();
        });
    }
    deactivateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.deactivateUser(req.params.id);
            res.status(204).end();
        });
    }
    reactivateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.reactivateUser(req.params.id);
            res.status(204).end();
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userService.deleteUser(req.params.id);
            res.status(204).end();
        });
    }
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { query } = req.query;
            if (!query) {
                res.status(400).end();
                return;
            }
            const users = yield this.userService.searchUsers(query);
            res.json(users);
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.createUser.bind(this));
        router.get('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.getUsers.bind(this));
        router.get('/search', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.searchUsers.bind(this));
        router.get('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getUserById.bind(this));
        router.put('/my/profile', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.updateMyProfile.bind(this));
        router.put('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.updateUser.bind(this));
        router.patch('/:id/promote', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.promoteUser.bind(this));
        router.patch('/:id/demote', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.demoteUser.bind(this));
        router.patch('/:id/deactivate', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.deactivateUser.bind(this));
        router.patch('/:id/reactivate', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.reactivateUser.bind(this));
        router.delete('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.deleteUser.bind(this));
        return router;
    }
}
exports.UserController = UserController;
