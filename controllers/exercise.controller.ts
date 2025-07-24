import {ExerciseService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole, ExerciseDifficulty} from "../models";

export class ExerciseController {
    constructor(public readonly exerciseService: ExerciseService,
                public readonly sessionService: SessionService) {
    }

    async createExercise(req: Request, res: Response) {
        if(!req.body || !req.body.name || !req.body.description || !req.body.targetedMuscles || !req.body.difficulty || !req.body.instructions) {
            res.status(400).end();
            return;
        }
        try {
            const exercise = await this.exerciseService.createExercise({
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
        } catch {
            res.status(500).end();
        }
    }

    async getExercises(req: Request, res: Response) {
        const { difficulty, muscle, equipment, search } = req.query;
        let exercises;

        if (search) {
            exercises = await this.exerciseService.searchExercises(search as string);
        } else if (difficulty) {
            exercises = await this.exerciseService.findExercisesByDifficulty(difficulty as ExerciseDifficulty);
        } else if (muscle) {
            exercises = await this.exerciseService.findExercisesByMuscle(muscle as string);
        } else if (equipment) {
            exercises = await this.exerciseService.findExercisesByEquipment(equipment as string);
        } else {
            exercises = await this.exerciseService.findExercises();
        }
        res.json(exercises);
    }

    async getExerciseById(req: Request, res: Response) {
        const exercise = await this.exerciseService.findExerciseById(req.params.id);
        if (!exercise) {
            res.status(404).end();
            return;
        }
        res.json(exercise);
    }

    async updateExercise(req: Request, res: Response) {
        const exercise = await this.exerciseService.updateExercise(req.params.id, req.body);
        if (!exercise) {
            res.status(404).end();
            return;
        }
        res.json(exercise);
    }

    async deleteExercise(req: Request, res: Response) {
        await this.exerciseService.deleteExercise(req.params.id);
        res.status(204).end();
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createExercise.bind(this));
        router.get('/',
            sessionMiddleware(this.sessionService),
            this.getExercises.bind(this));
        router.get('/:id',
            sessionMiddleware(this.sessionService),
            this.getExerciseById.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateExercise.bind(this));
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteExercise.bind(this));
        return router;
    }
}