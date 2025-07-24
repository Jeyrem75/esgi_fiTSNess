import { ChallengeInvitationService, ChallengeService, FriendshipService, ChallengeParticipationService, SessionService } from "../services/mongoose";
import { Request, Response, Router, json } from "express";
import { roleMiddleware, sessionMiddleware } from "../middlewares";
import { UserRole, InvitationStatus } from "../models";

export class ChallengeInvitationController {
    constructor(
        public readonly challengeInvitationService: ChallengeInvitationService,
        public readonly challengeService: ChallengeService,
        public readonly friendshipService: FriendshipService,
        public readonly challengeParticipationService: ChallengeParticipationService,
        public readonly sessionService: SessionService
    ) {}

    async inviteFriendsToChallenge(req: Request, res: Response) {
        if (!req.body || !req.body.friendIds || !Array.isArray(req.body.friendIds)) {
            res.status(400).json({ error: 'friendIds array is required' });
            return;
        }

        const challengeId = req.params.challengeId;
        const inviterId = req.user!._id;

        const challenge = await this.challengeService.findChallengeById(challengeId);
        if (!challenge) {
            res.status(404).json({ error: 'Challenge not found' });
            return;
        }

        if (!challenge.isActive) {
            res.status(400).json({ error: 'Challenge is not active' });
            return;
        }

        const invitations = [];
        const errors = [];

        for (const friendId of req.body.friendIds) {
            try {
                const areFriends = await this.friendshipService.areFriends(inviterId, friendId);
                if (!areFriends) {
                    errors.push({ friendId, error: 'Not friends with this user' });
                    continue;
                }

                const existingParticipation = await this.challengeParticipationService.findChallengeParticipation(friendId, challengeId);
                if (existingParticipation) {
                    errors.push({ friendId, error: 'User already participating in challenge' });
                    continue;
                }

                const invitation = await this.challengeInvitationService.createInvitation({
                    challenge: challengeId,
                    inviter: inviterId,
                    receiver: friendId,
                    status: InvitationStatus.PENDING,
                    message: req.body.message || `Rejoins-moi dans le défi "${challenge.title}" !`,
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });

                invitations.push(invitation);
            } catch (error: any) {
                errors.push({ friendId, error: error.message });
            }
        }

        res.status(201).json({
            message: `${invitations.length} invitation(s) sent successfully`,
            invitations,
            errors: errors.length > 0 ? errors : undefined
        });
    }

    async getMyPendingInvitations(req: Request, res: Response) {
        const invitations = await this.challengeInvitationService.findUserPendingInvitations(req.user!._id);
        res.json(invitations);
    }

    async getMySentInvitations(req: Request, res: Response) {
        const invitations = await this.challengeInvitationService.findUserSentInvitations(req.user!._id);
        res.json(invitations);
    }

    async getChallengeInvitations(req: Request, res: Response) {
        const challengeId = req.params.challengeId;
        
        const challenge = await this.challengeService.findChallengeById(challengeId);
        if (!challenge) {
            res.status(404).json({ error: 'Challenge not found' });
            return;
        }

        if (req.user!.role !== UserRole.SUPER_ADMIN) {
            res.status(403).json({ error: 'Not authorized to view these invitations' });
            return;
        }

        const invitations = await this.challengeInvitationService.findChallengeInvitations(challengeId);
        res.json(invitations);
    }

    async acceptInvitation(req: Request, res: Response) {
        const invitationId = req.params.invitationId;
        
        const invitation = await this.challengeInvitationService.findInvitationById(invitationId);
        if (!invitation) {
            res.status(404).json({ error: 'Invitation not found' });
            return;
        }

        const receiverId = typeof invitation.receiver === 'object' 
        ? invitation.receiver._id.toString() 
        : invitation.receiver.toString();
        const currentUserId = req.user!._id.toString();

        if (receiverId !== currentUserId) {
            res.status(403).json({ error: 'Not authorized to accept this invitation' });
            return;
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            res.status(400).json({ error: 'Invitation is no longer pending' });
            return;
        }

        if (invitation.expiresAt < new Date()) {
            res.status(400).json({ error: 'Invitation has expired' });
            return;
        }

        const challengeId = typeof invitation.challenge === 'object' 
        ? invitation.challenge._id.toString() 
        : invitation.challenge.toString();

        const challenge = await this.challengeService.findChallengeById(challengeId);
        if (!challenge || !challenge.isActive) {
            res.status(400).json({ error: 'Challenge is no longer available' });
            return;
        }

        const existingParticipation = await this.challengeParticipationService.findChallengeParticipation(
            req.user!._id, 
            invitation.challenge.toString()
        );
        if (existingParticipation) {
            res.status(400).json({ error: 'Already participating in this challenge' });
            return;
        }

        try {
            await this.challengeInvitationService.acceptInvitation(invitationId);

            const participation = await this.challengeParticipationService.joinChallenge({
                user: req.user!._id,
                challenge: invitation.challenge.toString(),
                joinedAt: new Date(),
                progress: 0,
                workoutSessions: [],
                isCompleted: false
            });

            res.status(200).json({
                message: 'Invitation accepted and joined challenge successfully',
                participation
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async declineInvitation(req: Request, res: Response) {
        const invitationId = req.params.invitationId;
        
        const invitation = await this.challengeInvitationService.findInvitationById(invitationId);
        if (!invitation) {
            res.status(404).json({ error: 'Invitation not found' });
            return;
        }

        const receiverId = typeof invitation.receiver === 'object' 
        ? invitation.receiver._id.toString() 
        : invitation.receiver.toString();
        const currentUserId = req.user!._id.toString();
        
        if (receiverId !== currentUserId) {
            res.status(403).json({ error: 'Not authorized to decline this invitation' });
            return;
        }

        if (invitation.status !== InvitationStatus.PENDING) {
            res.status(400).json({ error: 'Invitation is no longer pending' });
            return;
        }

        await this.challengeInvitationService.declineInvitation(invitationId);
        res.status(200).json({ message: 'Invitation declined successfully' });
    }

    async deleteInvitation(req: Request, res: Response) {
        const invitationId = req.params.invitationId;
        
        const invitation = await this.challengeInvitationService.findInvitationById(invitationId);
        if (!invitation) {
            res.status(404).json({ error: 'Invitation not found' });
            return;
        }

        if (req.user!.role !== UserRole.SUPER_ADMIN && invitation.inviter.toString() !== req.user!._id) {
            res.status(403).json({ error: 'Not authorized to delete this invitation' });
            return;
        }

        await this.challengeInvitationService.deleteInvitation(invitationId);
        res.status(204).end();
    }

    buildRouter(): Router {
        const router = Router();

        router.post('/challenge/:challengeId/invite',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.inviteFriendsToChallenge.bind(this)
        );
        router.get('/pending',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMyPendingInvitations.bind(this)
        );
        router.get('/sent',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getMySentInvitations.bind(this)
        );
        router.get('/challenge/:challengeId',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.getChallengeInvitations.bind(this)
        );
        router.post('/:invitationId/accept',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.acceptInvitation.bind(this)
        );
        router.post('/:invitationId/decline',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.declineInvitation.bind(this)
        );
        router.delete('/:invitationId',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.deleteInvitation.bind(this)
        );

        return router;
    }
}