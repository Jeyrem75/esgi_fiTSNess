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
exports.ChallengeInvitationController = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const models_1 = require("../models");
class ChallengeInvitationController {
    constructor(challengeInvitationService, challengeService, friendshipService, challengeParticipationService, sessionService) {
        this.challengeInvitationService = challengeInvitationService;
        this.challengeService = challengeService;
        this.friendshipService = friendshipService;
        this.challengeParticipationService = challengeParticipationService;
        this.sessionService = sessionService;
    }
    inviteFriendsToChallenge(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body || !req.body.friendIds || !Array.isArray(req.body.friendIds)) {
                res.status(400).json({ error: 'friendIds array is required' });
                return;
            }
            const challengeId = req.params.challengeId;
            const inviterId = req.user._id;
            const challenge = yield this.challengeService.findChallengeById(challengeId);
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
                    const areFriends = yield this.friendshipService.areFriends(inviterId, friendId);
                    if (!areFriends) {
                        errors.push({ friendId, error: 'Not friends with this user' });
                        continue;
                    }
                    const existingParticipation = yield this.challengeParticipationService.findChallengeParticipation(friendId, challengeId);
                    if (existingParticipation) {
                        errors.push({ friendId, error: 'User already participating in challenge' });
                        continue;
                    }
                    const invitation = yield this.challengeInvitationService.createInvitation({
                        challenge: challengeId,
                        inviter: inviterId,
                        receiver: friendId,
                        status: models_1.InvitationStatus.PENDING,
                        message: req.body.message || `Rejoins-moi dans le défi "${challenge.title}" !`,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    invitations.push(invitation);
                }
                catch (error) {
                    errors.push({ friendId, error: error.message });
                }
            }
            res.status(201).json({
                message: `${invitations.length} invitation(s) sent successfully`,
                invitations,
                errors: errors.length > 0 ? errors : undefined
            });
        });
    }
    getMyPendingInvitations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitations = yield this.challengeInvitationService.findUserPendingInvitations(req.user._id);
            res.json(invitations);
        });
    }
    getMySentInvitations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitations = yield this.challengeInvitationService.findUserSentInvitations(req.user._id);
            res.json(invitations);
        });
    }
    getChallengeInvitations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const challengeId = req.params.challengeId;
            const challenge = yield this.challengeService.findChallengeById(challengeId);
            if (!challenge) {
                res.status(404).json({ error: 'Challenge not found' });
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN) {
                res.status(403).json({ error: 'Not authorized to view these invitations' });
                return;
            }
            const invitations = yield this.challengeInvitationService.findChallengeInvitations(challengeId);
            res.json(invitations);
        });
    }
    acceptInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitationId = req.params.invitationId;
            const invitation = yield this.challengeInvitationService.findInvitationById(invitationId);
            if (!invitation) {
                res.status(404).json({ error: 'Invitation not found' });
                return;
            }
            const receiverId = typeof invitation.receiver === 'object'
                ? invitation.receiver._id.toString()
                : invitation.receiver.toString();
            const currentUserId = req.user._id.toString();
            if (receiverId !== currentUserId) {
                res.status(403).json({ error: 'Not authorized to accept this invitation' });
                return;
            }
            if (invitation.status !== models_1.InvitationStatus.PENDING) {
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
            const challenge = yield this.challengeService.findChallengeById(challengeId);
            if (!challenge || !challenge.isActive) {
                res.status(400).json({ error: 'Challenge is no longer available' });
                return;
            }
            const existingParticipation = yield this.challengeParticipationService.findChallengeParticipation(req.user._id, invitation.challenge.toString());
            if (existingParticipation) {
                res.status(400).json({ error: 'Already participating in this challenge' });
                return;
            }
            try {
                yield this.challengeInvitationService.acceptInvitation(invitationId);
                const participation = yield this.challengeParticipationService.joinChallenge({
                    user: req.user._id,
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
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    declineInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitationId = req.params.invitationId;
            const invitation = yield this.challengeInvitationService.findInvitationById(invitationId);
            if (!invitation) {
                res.status(404).json({ error: 'Invitation not found' });
                return;
            }
            const receiverId = typeof invitation.receiver === 'object'
                ? invitation.receiver._id.toString()
                : invitation.receiver.toString();
            const currentUserId = req.user._id.toString();
            if (receiverId !== currentUserId) {
                res.status(403).json({ error: 'Not authorized to decline this invitation' });
                return;
            }
            if (invitation.status !== models_1.InvitationStatus.PENDING) {
                res.status(400).json({ error: 'Invitation is no longer pending' });
                return;
            }
            yield this.challengeInvitationService.declineInvitation(invitationId);
            res.status(200).json({ message: 'Invitation declined successfully' });
        });
    }
    deleteInvitation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const invitationId = req.params.invitationId;
            const invitation = yield this.challengeInvitationService.findInvitationById(invitationId);
            if (!invitation) {
                res.status(404).json({ error: 'Invitation not found' });
                return;
            }
            if (req.user.role !== models_1.UserRole.SUPER_ADMIN && invitation.inviter.toString() !== req.user._id) {
                res.status(403).json({ error: 'Not authorized to delete this invitation' });
                return;
            }
            yield this.challengeInvitationService.deleteInvitation(invitationId);
            res.status(204).end();
        });
    }
    buildRouter() {
        const router = (0, express_1.Router)();
        router.post('/challenge/:challengeId/invite', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), (0, express_1.json)(), this.inviteFriendsToChallenge.bind(this));
        router.get('/pending', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMyPendingInvitations.bind(this));
        router.get('/sent', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getMySentInvitations.bind(this));
        router.get('/challenge/:challengeId', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.getChallengeInvitations.bind(this));
        router.post('/:invitationId/accept', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.acceptInvitation.bind(this));
        router.post('/:invitationId/decline', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.declineInvitation.bind(this));
        router.delete('/:invitationId', (0, middlewares_1.sessionMiddleware)(this.sessionService), (0, middlewares_1.roleMiddleware)(models_1.UserRole.USER), this.deleteInvitation.bind(this));
        return router;
    }
}
exports.ChallengeInvitationController = ChallengeInvitationController;
