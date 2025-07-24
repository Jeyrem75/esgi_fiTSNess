import {WorkoutService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";

export class WorkoutController {
    constructor(public readonly workoutService: WorkoutService,
                public readonly sessionService: SessionService) {
    }

    async createWorkoutSession(req: Request, res: Response) {
        if(!req.body || !req.body.exercises || !req.body.duration) {
            res.status(400).end();
            return;
        }
        try {
            const session = await this.workoutService.createWorkoutSession({
                user: req.user!._id,
                challenge: req.body.challenge,
                gym: req.body.gym,
                exercises: req.body.exercises,
                duration: req.body.duration,
                caloriesBurned: req.body.caloriesBurned,
                notes: req.body.notes,
                sessionDate: req.body.sessionDate ? new Date(req.body.sessionDate) : new Date()
            });
            res.status(201).json(session);
        } catch {
            res.status(500).end();
        }
    }

    async getWorkoutSessions(req: Request, res: Response) {
        const { user, challenge } = req.query;
        let sessions;

        if (user) {
            sessions = await this.workoutService.findUserWorkoutSessions(user as string);
        } else if (challenge) {
            sessions = await this.workoutService.findChallengeWorkoutSessions(challenge as string);
        } else {
            sessions = await this.workoutService.findWorkoutSessions();
        }
        res.json(sessions);
    }

    async getMyWorkoutSessions(req: Request, res: Response) {
        const sessions = await this.workoutService.findUserWorkoutSessions(req.user!._id);
        res.json(sessions);
    }

    async getWorkoutSessionById(req: Request, res: Response) {
        const session = await this.workoutService.findWorkoutSessionById(req.params.id);
        if (!session) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN && session.user.toString() !== req.user!._id) {
            res.status(403).end();
            return;
        }
        res.json(session);
    }

    async updateWorkoutSession(req: Request, res: Response) {
        const session = await this.workoutService.findWorkoutSessionById(req.params.id);
        if (!session) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN && session.user.toString() !== req.user!._id) {
            res.status(403).end();
            return;
        }
        const updatedSession = await this.workoutService.updateWorkoutSession(req.params.id, req.body);
        res.json(updatedSession);
    }

    async deleteWorkoutSession(req: Request, res: Response) {
        const session = await this.workoutService.findWorkoutSessionById(req.params.id);
        if (!session) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN && session.user.toString() !== req.user!._id) {
            res.status(403).end();
            return;
        }
        await this.workoutService.deleteWorkoutSession(req.params.id);
        res.status(204).end();
    }

    async getUserStats(req: Request, res: Response) {
        const userId = req.params.userId || req.user!._id;
        const stats = await this.workoutService.getUserStats(userId);
        res.json(stats);
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.createWorkoutSession.bind(this));
        router.get('/',
            sessionMiddleware(this.sessionService),
            this.getWorkoutSessions.bind(this));
        router.get('/my',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMyWorkoutSessions.bind(this));
        router.get('/stats',
            sessionMiddleware(this.sessionService),
            this.getUserStats.bind(this));
        router.get('/stats/:userId',
            sessionMiddleware(this.sessionService),
            this.getUserStats.bind(this));
        router.get('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getWorkoutSessionById.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.updateWorkoutSession.bind(this));
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.deleteWorkoutSession.bind(this));
        return router;
    }
}