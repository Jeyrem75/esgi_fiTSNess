import {BadgeService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole, BadgeRarity} from "../models";

export class BadgeController {
    constructor(public readonly badgeService: BadgeService,
                public readonly sessionService: SessionService) {
    }

    async createBadge(req: Request, res: Response) {
        if(!req.body || !req.body.name || !req.body.description || !req.body.rules || !req.body.rarity) {
            res.status(400).end();
            return;
        }
        try {
            const badge = await this.badgeService.createBadge({
                name: req.body.name,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                rules: req.body.rules,
                isActive: true,
                rarity: req.body.rarity
            });
            res.status(201).json(badge);
        } catch {
            res.status(500).end();
        }
    }

    async getBadges(req: Request, res: Response) {
        const { rarity, active } = req.query;
        let badges;

        if (rarity) {
            badges = await this.badgeService.findBadgesByRarity(rarity as BadgeRarity);
        } else if (active === 'true') {
            badges = await this.badgeService.findActiveBadges();
        } else {
            badges = await this.badgeService.findBadges();
        }
        res.json(badges);
    }

    async getBadgeById(req: Request, res: Response) {
        const badge = await this.badgeService.findBadgeById(req.params.id);
        if (!badge) {
            res.status(404).end();
            return;
        }
        res.json(badge);
    }

    async updateBadge(req: Request, res: Response) {
        const badge = await this.badgeService.updateBadge(req.params.id, req.body);
        if (!badge) {
            res.status(404).end();
            return;
        }
        res.json(badge);
    }

    async deleteBadge(req: Request, res: Response) {
        await this.badgeService.deleteBadge(req.params.id);
        res.status(204).end();
    }

    async deactivateBadge(req: Request, res: Response) {
        await this.badgeService.deactivateBadge(req.params.id);
        res.status(204).end();
    }

    async reactivateBadge(req: Request, res: Response) {
        await this.badgeService.reactivateBadge(req.params.id);
        res.status(204).end();
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createBadge.bind(this));
        router.get('/',
            sessionMiddleware(this.sessionService),
            this.getBadges.bind(this));
        router.get('/:id',
            sessionMiddleware(this.sessionService),
            this.getBadgeById.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.updateBadge.bind(this));
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteBadge.bind(this));
        router.patch('/:id/deactivate',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deactivateBadge.bind(this));
        router.patch('/:id/reactivate',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.reactivateBadge.bind(this));
        return router;
    }
}