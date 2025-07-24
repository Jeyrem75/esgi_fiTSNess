import {UserBadgeService, BadgeService, WorkoutService, ChallengeParticipationService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";

export class UserBadgeController {
    constructor(public readonly userBadgeService: UserBadgeService,
                public readonly badgeService: BadgeService,
                public readonly workoutService: WorkoutService,
                public readonly challengeParticipationService: ChallengeParticipationService,
                public readonly sessionService: SessionService) {
    }

    async getUserBadges(req: Request, res: Response) {
        const userId = req.params.userId || req.user!._id;
        const userBadges = await this.userBadgeService.findUserBadges(userId);
        res.json(userBadges);
    }

    async getMyBadges(req: Request, res: Response) {
        const userBadges = await this.userBadgeService.findUserBadges(req.user!._id);
        res.json(userBadges);
    }

    async checkBadges(req: Request, res: Response) {
        const workoutStats = await this.workoutService.getUserStats(req.user!._id);
        const challengeStats = await this.challengeParticipationService.getUserChallengeStats(req.user!._id);
        const userStats = { ...workoutStats, ...challengeStats };
        
        const activeBadges = await this.badgeService.findActiveBadges();
        const awardedBadges = await this.userBadgeService.checkAndAwardBadges(req.user!._id, userStats, activeBadges);
        res.json(awardedBadges);
    }

    async awardBadge(req: Request, res: Response) {
        if(!req.body || !req.body.userId || !req.body.badgeId) {
            res.status(400).end();
            return;
        }
        try {
            const userBadge = await this.userBadgeService.awardBadge({
                user: req.body.userId,
                badge: req.body.badgeId,
                earnedAt: new Date()
            });
            res.status(201).json(userBadge);
        } catch {
            res.status(500).end();
        }
    }

    async removeBadge(req: Request, res: Response) {
        const { userId, badgeId } = req.params;
        await this.userBadgeService.removeUserBadge(userId, badgeId);
        res.status(204).end();
    }

    buildRouter(): Router {
        const router = Router();
        router.get('/my',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMyBadges.bind(this));
        router.get('/check',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.checkBadges.bind(this));
        router.get('/user/:userId',
            sessionMiddleware(this.sessionService),
            this.getUserBadges.bind(this));
        router.post('/award',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.awardBadge.bind(this));
        router.delete('/:userId/:badgeId',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.removeBadge.bind(this));
        return router;
    }
}