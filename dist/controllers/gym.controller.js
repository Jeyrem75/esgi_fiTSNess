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
exports.GymController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class GymController {
    constructor(gymService, sessionService) {
        this.gymService = gymService;
        this.sessionService = sessionService;
    }
    createGym(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.name || !req.body.address || !req.body.capacity) {
                res.status(400).end();
                return;
            }
            const address = req.body.address;
            if (!address.street || !address.city || !address.zipCode) {
                res.status(400).end();
                return;
            }
            try {
                const gym = yield this.gymService.createGym({
                    name: req.body.name,
                    address: address,
                    phone: req.body.phone,
                    description: req.body.description,
                    equipment: req.body.equipment || [],
                    activities: req.body.activities || [],
                    capacity: req.body.capacity,
                    owner: req.user._id,
                    status: models_1.GymStatus.PENDING,
                    images: req.body.images || []
                });
                res.status(201).json(gym);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    getGyms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { status, search } = req.query;
            let gyms;
            if (search) {
                gyms = yield this.gymService.searchGyms(search);
            }
            else if (status) {
                gyms = yield this.gymService.findGymsByStatus(status);
            }
            else {
                gyms = yield this.gymService.findGyms();
            }
            res.json(gyms);
        });
    }
    getGymById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gym = yield this.gymService.findGymById(req.params.id);
            if (!gym) {
                res.status(404).end();
                return;
            }
            res.json(gym);
        });
    }
    getMyGyms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gyms = yield this.gymService.findGymsByOwner(req.user._id);
            res.json(gyms);
        });
    }
    updateGym(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gym = yield this.gymService.findGymById(req.params.id);
            if (!gym) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN) {
                const gymOwnerId = typeof gym.owner === 'object' ? gym.owner._id.toString() : gym.owner.toString();
                if (gymOwnerId !== req.user._id) {
                    res.status(403).end();
                    return;
                }
            }
            const updatedGym = yield this.gymService.updateGym(req.params.id, req.body);
            res.json(updatedGym);
        });
    }
    deleteGym(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gym = yield this.gymService.findGymById(req.params.id);
            if (!gym) {
                res.status(404).end();
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN) {
                res.status(403).end();
                return;
            }
            yield this.gymService.deleteGym(req.params.id);
            res.status(204).end();
        });
    }
    approveGym(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gymService.approveGym(req.params.id);
            res.status(204).end();
        });
    }
    rejectGym(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.gymService.rejectGym(req.params.id);
            res.status(204).end();
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.GYM_OWNER), (0, express_1.json)(), this.createGym.bind(this));
        router.get('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getGyms.bind(this));
        router.get('/my', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.GYM_OWNER), this.getMyGyms.bind(this));
        router.get('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getGymById.bind(this));
        router.put('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.GYM_OWNER), (0, express_1.json)(), this.updateGym.bind(this));
        router.delete('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.GYM_OWNER), this.deleteGym.bind(this));
        router.patch('/:id/approve', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.approveGym.bind(this));
        router.patch('/:id/reject', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.rejectGym.bind(this));
        return router;
    }
}
exports.GymController = GymController;
