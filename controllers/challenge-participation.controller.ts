import {ChallengeParticipationService, ChallengeService, SessionService, UserBadgeService, BadgeService, WorkoutService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";

export class ChallengeParticipationController {
    constructor(public readonly challengeParticipationService: ChallengeParticipationService,
                public readonly challengeService: ChallengeService,
                public readonly userBadgeService: UserBadgeService,
                public readonly badgeService: BadgeService,
                public readonly workoutService: WorkoutService,
                public readonly sessionService: SessionService) {
    }

    async joinChallenge(req: Request, res: Response) {
        const challenge = await this.challengeService.findChallengeById(req.params.challengeId);
        if (!challenge) {
            res.status(404).end();
            return;
        }
        
        const existingParticipation = await this.challengeParticipationService.findChallengeParticipation(req.user!._id, req.params.challengeId);
        if (existingParticipation) {
            res.status(409).end();
            return;
        }

        if (!challenge.isActive) {
            res.status(400).json({ error: 'Challenge is not active' });
            return;
        }

        try {
            const participation = await this.challengeParticipationService.joinChallenge({
                user: req.user!._id,
                challenge: req.params.challengeId,
                joinedAt: new Date(),
                progress: 0,
                workoutSessions: [],
                isCompleted: false
            });
            res.status(201).json(participation);
        } catch {
            res.status(500).end();
        }
    }

    async getMyChallengeParticipations(req: Request, res: Response) {
        const participations = await this.challengeParticipationService.findUserChallengeParticipations(req.user!._id);
        res.json(participations);
    }

    async getChallengeParticipations(req: Request, res: Response) {
        const participations = await this.challengeParticipationService.findChallengeParticipations(req.params.challengeId);
        res.json(participations);
    }

    async updateParticipation(req: Request, res: Response) {
        const participation = await this.challengeParticipationService.updateChallengeParticipation(req.params.id, req.body);
        if (!participation) {
            res.status(404).end();
            return;
        }
        res.json(participation);
    }

    async completeChallenge(req: Request, res: Response) {
        const participation = await this.challengeParticipationService.findChallengeParticipation(req.user!._id, req.params.challengeId);
        if (!participation) {
            res.status(404).end();
            return;
        }
        if (participation.isCompleted) {
            res.status(400).end();
            return;
        }

        const finalScore = req.body.finalScore || 100;
        await this.challengeParticipationService.completeChallenge(participation._id, finalScore);

        const workoutStats = await this.workoutService.getUserStats(req.user!._id);
        const challengeStats = await this.challengeParticipationService.getUserChallengeStats(req.user!._id);
        const userStats = { ...workoutStats, ...challengeStats };
        
        const activeBadges = await this.badgeService.findActiveBadges();
        await this.userBadgeService.checkAndAwardBadges(req.user!._id, userStats, activeBadges);

        res.status(204).end();
    }

    async leaveChallenge(req: Request, res: Response) {
        const participation = await this.challengeParticipationService.findChallengeParticipation(req.user!._id, req.params.challengeId);
        if (!participation) {
            res.status(404).end();
            return;
        }
        if (participation.isCompleted) {
            res.status(400).end();
            return;
        }
        await this.challengeParticipationService.deleteParticipation(participation._id);
        res.status(204).end();
    }

    async addWorkoutToChallenge(req: Request, res: Response) {
        if(!req.body || !req.body.workoutSessionId) {
            res.status(400).end();
            return;
        }
        
        const participation = await this.challengeParticipationService.findChallengeParticipation(req.user!._id, req.params.challengeId);
        if (!participation) {
            res.status(404).end();
            return;
        }

        const updatedSessions = [...participation.workoutSessions, req.body.workoutSessionId];
        const newProgress = Math.min(100, participation.progress + 10);
        
        const updatedParticipation = await this.challengeParticipationService.updateChallengeParticipation(participation._id, {
            workoutSessions: updatedSessions,
            progress: newProgress
        });
        
        res.json(updatedParticipation);
    }

    async getChallengeStats(req: Request, res: Response) {
        const userId = req.params.userId || req.user!._id;
        const stats = await this.challengeParticipationService.getUserChallengeStats(userId);
        res.json(stats);
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/challenge/:challengeId/join',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.joinChallenge.bind(this));
        router.get('/my',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMyChallengeParticipations.bind(this));
        router.get('/challenge/:challengeId',
            sessionMiddleware(this.sessionService),
            this.getChallengeParticipations.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateParticipation.bind(this));
        router.post('/challenge/:challengeId/complete',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.completeChallenge.bind(this));
        router.delete('/challenge/:challengeId/leave',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.leaveChallenge.bind(this));
        router.post('/challenge/:challengeId/workout',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.addWorkoutToChallenge.bind(this));
        router.get('/stats/',
            sessionMiddleware(this.sessionService),
            this.getChallengeStats.bind(this));
        router.get('/stats/:userId',
            sessionMiddleware(this.sessionService),
            this.getChallengeStats.bind(this));
        return router;
    }
}