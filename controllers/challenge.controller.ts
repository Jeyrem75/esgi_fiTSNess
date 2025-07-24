import {ChallengeService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole, ChallengeDifficulty, ChallengeCategory} from "../models";

export class ChallengeController {
    constructor(public readonly challengeService: ChallengeService,
                public readonly sessionService: SessionService) {
    }

    async createChallenge(req: Request, res: Response) {
        if(!req.body || !req.body.title || !req.body.description || !req.body.exercises || 
           !req.body.duration || !req.body.difficulty || !req.body.objectives || 
           !req.body.rules || !req.body.startDate || !req.body.endDate || !req.body.category) {
            res.status(400).end();
            return;
        }
        try {
            let rewards = req.body.rewards || [];
            if (req.user!.role === UserRole.USER) {
                rewards = [];
            }
            const challenge = await this.challengeService.createChallenge({
                title: req.body.title,
                description: req.body.description,
                exercises: req.body.exercises,
                duration: req.body.duration,
                difficulty: req.body.difficulty,
                objectives: req.body.objectives,
                rules: req.body.rules,
                startDate: new Date(req.body.startDate),
                endDate: new Date(req.body.endDate),
                maxParticipants: req.body.maxParticipants,
                rewards: rewards,
                creator: req.user!._id,
                gym: req.body.gym,
                isActive: true,
                category: req.body.category
            });
            res.status(201).json(challenge);
        } catch {
            res.status(500).end();
        }
    }

    async getChallenges(req: Request, res: Response) {
        const { category, difficulty, gym, active, search } = req.query;
        let challenges;

        if (search) {
            challenges = await this.challengeService.searchChallenges(search as string);
        } else if (category) {
            challenges = await this.challengeService.findChallengesByCategory(category as ChallengeCategory);
        } else if (difficulty) {
            challenges = await this.challengeService.findChallengesByDifficulty(difficulty as ChallengeDifficulty);
        } else if (gym) {
            challenges = await this.challengeService.findChallengesByGym(gym as string);
        } else if (active === 'true') {
            challenges = await this.challengeService.findActiveChallenges();
        } else {
            challenges = await this.challengeService.findChallenges();
        }
        res.json(challenges);
    }

    async getChallengeById(req: Request, res: Response) {
        const challenge = await this.challengeService.findChallengeById(req.params.id);
        if (!challenge) {
            res.status(404).end();
            return;
        }
        res.json(challenge);
    }

    async getMyChallenges(req: Request, res: Response) {
        const challenges = await this.challengeService.findChallengesByCreator(req.user!._id);
        res.json(challenges);
    }

    async updateChallenge(req: Request, res: Response) {
        const challenge = await this.challengeService.findChallengeById(req.params.id);
        if (!challenge) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user!._id) {
            res.status(403).end();
            return;
        }
        const updatedChallenge = await this.challengeService.updateChallenge(req.params.id, req.body);
        res.json(updatedChallenge);
    }

    async deleteChallenge(req: Request, res: Response) {
        const challenge = await this.challengeService.findChallengeById(req.params.id);
        if (!challenge) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user!._id) {
            res.status(403).end();
            return;
        }
        await this.challengeService.deleteChallenge(req.params.id);
        res.status(204).end();
    }

    async deactivateChallenge(req: Request, res: Response) {
        const challenge = await this.challengeService.findChallengeById(req.params.id);
        if (!challenge) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user!._id) {
            res.status(403).end();
            return;
        }
        await this.challengeService.deactivateChallenge(req.params.id);
        res.status(204).end();
    }

    async reactivateChallenge(req: Request, res: Response) {
        const challenge = await this.challengeService.findChallengeById(req.params.id);
        if (!challenge) {
            res.status(404).end();
            return;
        }
        if (req.user!.role !== UserRole.SUPER_ADMIN && challenge.creator.toString() !== req.user!._id) {
            res.status(403).end();
            return;
        }
        await this.challengeService.reactivateChallenge(req.params.id);
        res.status(204).end();
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.createChallenge.bind(this));
        router.get('/',
            sessionMiddleware(this.sessionService),
            this.getChallenges.bind(this));
        router.get('/my',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMyChallenges.bind(this));
        router.get('/:id',
            sessionMiddleware(this.sessionService),
            this.getChallengeById.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.updateChallenge.bind(this));
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.deleteChallenge.bind(this));
        router.patch('/:id/deactivate',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.deactivateChallenge.bind(this));
        router.patch('/:id/reactivate',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.reactivateChallenge.bind(this));
        return router;
    }
}