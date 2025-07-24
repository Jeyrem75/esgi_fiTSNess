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
exports.ExerciseController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class ExerciseController {
    constructor(exerciseService, sessionService) {
        this.exerciseService = exerciseService;
        this.sessionService = sessionService;
    }
    createExercise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.name || !req.body.description || !req.body.targetedMuscles || !req.body.difficulty || !req.body.instructions) {
                res.status(400).end();
                return;
            }
            try {
                const exercise = yield this.exerciseService.createExercise({
                    name: req.body.name,
                    description: req.body.description,
                    targetedMuscles: req.body.targetedMuscles,
                    difficulty: req.body.difficulty,
                    equipment: req.body.equipment || [],
                    instructions: req.body.instructions,
                    imageUrl: req.body.imageUrl,
                    videoUrl: req.body.videoUrl
                });
                res.status(201).json(exercise);
            }
            catch (_a) {
                res.status(500).end();
            }
        });
    }
    getExercises(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { difficulty, muscle, equipment, search } = req.query;
            let exercises;
            if (search) {
                exercises = yield this.exerciseService.searchExercises(search);
            }
            else if (difficulty) {
                exercises = yield this.exerciseService.findExercisesByDifficulty(difficulty);
            }
            else if (muscle) {
                exercises = yield this.exerciseService.findExercisesByMuscle(muscle);
            }
            else if (equipment) {
                exercises = yield this.exerciseService.findExercisesByEquipment(equipment);
            }
            else {
                exercises = yield this.exerciseService.findExercises();
            }
            res.json(exercises);
        });
    }
    getExerciseById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const exercise = yield this.exerciseService.findExerciseById(req.params.id);
            if (!exercise) {
                res.status(404).end();
                return;
            }
            res.json(exercise);
        });
    }
    updateExercise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const exercise = yield this.exerciseService.updateExercise(req.params.id, req.body);
            if (!exercise) {
                res.status(404).end();
                return;
            }
            res.json(exercise);
        });
    }
    deleteExercise(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exerciseService.deleteExercise(req.params.id);
            res.status(204).end();
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.createExercise.bind(this));
        router.get('/', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getExercises.bind(this));
        router.get('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), this.getExerciseById.bind(this));
        router.put('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), (0, express_1.json)(), this.updateExercise.bind(this));
        router.delete('/:id', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.SUPER_ADMIN), this.deleteExercise.bind(this));
        return router;
    }
}
exports.ExerciseController = ExerciseController;
