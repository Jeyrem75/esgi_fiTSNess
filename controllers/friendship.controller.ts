import {FriendshipService, SessionService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {UserRole} from "../models";

export class FriendshipController {
    constructor(public readonly friendshipService: FriendshipService,
                public readonly sessionService: SessionService) {
    }

    async sendFriendRequest(req: Request, res: Response) {
        if(!req.body || !req.body.addresseeId) {
            res.status(400).end();
            return;
        }
        if (req.body.addresseeId === req.user!._id) {
            res.status(400).end();
            return;
        }
        try {
            const friendship = await this.friendshipService.sendFriendRequest(req.user!._id, req.body.addresseeId);
            res.status(201).json(friendship);
        } catch {
            res.status(409).end();
        }
    }

    async acceptFriendRequest(req: Request, res: Response) {
        await this.friendshipService.acceptFriendRequest(req.params.id);
        res.status(204).end();
    }

    async declineFriendRequest(req: Request, res: Response) {
        await this.friendshipService.declineFriendRequest(req.params.id);
        res.status(204).end();
    }

    async blockUser(req: Request, res: Response) {
        await this.friendshipService.blockUser(req.params.id);
        res.status(204).end();
    }

    async removeFriend(req: Request, res: Response) {
        if(!req.body || !req.body.friendId) {
            res.status(400).end();
            return;
        }
        await this.friendshipService.removeFriend(req.user!._id, req.body.friendId);
        res.status(204).end();
    }

    async getMyFriends(req: Request, res: Response) {
        const friends = await this.friendshipService.findUserFriends(req.user!._id);
        res.json(friends);
    }

    async getPendingRequests(req: Request, res: Response) {
        const requests = await this.friendshipService.findPendingRequests(req.user!._id);
        res.json(requests);
    }

    async getSentRequests(req: Request, res: Response) {
        const requests = await this.friendshipService.findSentRequests(req.user!._id);
        res.json(requests);
    }

    async checkFriendship(req: Request, res: Response) {
        const { userId } = req.params;
        const areFriends = await this.friendshipService.areFriends(req.user!._id, userId);
        res.json({ areFriends });
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/request',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.sendFriendRequest.bind(this));
        router.patch('/:id/accept',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.acceptFriendRequest.bind(this));
        router.patch('/:id/decline',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.declineFriendRequest.bind(this));
        router.patch('/:id/block',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.blockUser.bind(this));
        router.delete('/remove',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.removeFriend.bind(this));
        router.get('/my',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMyFriends.bind(this));
        router.get('/requests/pending',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getPendingRequests.bind(this));
        router.get('/requests/sent',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getSentRequests.bind(this));
        router.get('/check/:userId',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.checkFriendship.bind(this));
        return router;
    }
}