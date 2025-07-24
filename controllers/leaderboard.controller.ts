import {LeaderboardService, ChallengeParticipationService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";

export class LeaderboardController {
    constructor(public readonly leaderboardService: LeaderboardService,
                public readonly challengeParticipationService: ChallengeParticipationService,
                public readonly sessionService: SessionService) {
    }

    async getChallengeLeaderboard(req: Request, res: Response) {
        const leaderboard = await this.leaderboardService.findLeaderboard(req.params.challengeId);
        if (!leaderboard) {
            const participations = await this.challengeParticipationService.findChallengeParticipations(req.params.challengeId);
            const rankings = participations
                .filter(p => p.isCompleted)
                .map((p, index) => ({
                    user: p.user,
                    score: p.finalScore || 0,
                    position: index + 1,
                    completedAt: p.completedAt
                }))
                .sort((a, b) => b.score - a.score)
                .map((entry, index) => ({ ...entry, position: index + 1 }));

            const newLeaderboard = await this.leaderboardService.updateLeaderboard(req.params.challengeId, rankings);
            res.json(newLeaderboard);
        } else {
            res.json(leaderboard);
        }
    }

    async getMyLeaderboards(req: Request, res: Response) {
        const leaderboards = await this.leaderboardService.findUserLeaderboards(req.user!._id);
        res.json(leaderboards);
    }

    async updateLeaderboard(req: Request, res: Response) {
        if(!req.body || !req.body.rankings) {
            res.status(400).end();
            return;
        }
        const leaderboard = await this.leaderboardService.updateLeaderboard(req.params.challengeId, req.body.rankings);
        res.json(leaderboard);
    }

    async createLeaderboard(req: Request, res: Response) {
        if(!req.body || !req.body.challengeId || !req.body.rankings) {
            res.status(400).end();
            return;
        }
        try {
            const leaderboard = await this.leaderboardService.createLeaderboard({
                challenge: req.body.challengeId,
                rankings: req.body.rankings,
                lastUpdated: new Date()
            });
            res.status(201).json(leaderboard);
        } catch {
            res.status(500).end();
        }
    }

    async deleteLeaderboard(req: Request, res: Response) {
        await this.leaderboardService.deleteLeaderboard(req.params.challengeId);
        res.status(204).end();
    }

    async refreshLeaderboard(req: Request, res: Response) {
        const participations = await this.challengeParticipationService.findChallengeParticipations(req.params.challengeId);
        const rankings = participations
            .filter((p) => p.isCompleted)
            .map((p, index) => ({
                user: p.user,
                score: p.finalScore || 0,
                position: index + 1,
                completedAt: p.completedAt
            }))
            .sort((a, b) => b.score - a.score)
            .map((entry, index) => ({ ...entry, position: index + 1 }));

        const leaderboard = await this.leaderboardService.updateLeaderboard(req.params.challengeId, rankings);
        res.json(leaderboard);
    }

    buildRouter(): Router {
        const router = Router();
        router.get('/challenge/:challengeId',
            sessionMiddleware(this.sessionService),
            this.getChallengeLeaderboard.bind(this));
        router.get('/my',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMyLeaderboards.bind(this));
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createLeaderboard.bind(this));
        router.put('/challenge/:challengeId',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateLeaderboard.bind(this));
        router.delete('/challenge/:challengeId',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteLeaderboard.bind(this));
        router.post('/challenge/:challengeId/refresh',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.refreshLeaderboard.bind(this));
        return router;
    }
}