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
exports.AuthController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class AuthController {
    constructor(userService, sessionService) {
        this.userService = userService;
        this.sessionService = sessionService;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.email || !req.body.password) {
                res.status(400).end();
                return;
            }
            const user = yield this.userService.findUser(req.body.email, req.body.password);
            if (!user || !user.isActive) {
                res.status(401).end();
                return;
            }
            const session = yield this.sessionService.createSession({
                user: user,
                expirationDate: new Date(Date.now() + 1296000000)
            });
            res.status(201).json(session);
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json(req.user);
        });
    }
    subscribe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.email || !req.body.password
                || !req.body.lastName || !req.body.firstName) {
                res.status(400).end();
                return;
            }
            try {
                const user = yield this.userService.createUser({
                    email: req.body.email,
                    role: models_1.UserRole.USER,
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
                });
                res.status(201).json(user);
            }
            catch (_a) {
                res.status(409).end();
            }
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/login', (0, express_1.json)(), this.login.bind(this));
        router.post('/subscribe', (0, express_1.json)(), this.subscribe.bind(this));
        router.get('/me', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.me.bind(this));
        return router;
    }
}
exports.AuthController = AuthController;
