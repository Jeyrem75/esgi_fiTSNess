import { Mongoose, Model, isValidObjectId } from "mongoose";
import { ChallengeInvitation, InvitationStatus } from "../../../models";
import { challengeInvitationSchema } from "../schema";

export type CreateChallengeInvitation = Omit<ChallengeInvitation, '_id' | 'createdAt' | 'updatedAt'>;

export class ChallengeInvitationService {
    readonly challengeInvitationModel: Model<ChallengeInvitation>;

    constructor(public readonly connection: Mongoose) {
        this.challengeInvitationModel = connection.model('ChallengeInvitation', challengeInvitationSchema());
    }

    async createInvitation(invitation: CreateChallengeInvitation): Promise<ChallengeInvitation> {
        const existingInvitation = await this.challengeInvitationModel.findOne({
            challenge: invitation.challenge,
            inviter: invitation.inviter,
            receiver: invitation.receiver,
            status: InvitationStatus.PENDING
        });

        if (existingInvitation) {
            throw new Error('Invitation already exists');
        }

        return this.challengeInvitationModel.create(invitation);
    }

    async findInvitationById(invitationId: string): Promise<ChallengeInvitation | null> {
        if (!isValidObjectId(invitationId)) {
            return null;
        }
        return this.challengeInvitationModel.findById(invitationId)
            .populate('inviter')
            .populate('receiver');
    }

    async findUserPendingInvitations(userId: string): Promise<ChallengeInvitation[]> {
        if (!isValidObjectId(userId)) {
            return [];
        }
        return this.challengeInvitationModel.find({
            receiver: userId,
            status: InvitationStatus.PENDING,
            expiresAt: { $gt: new Date() }
        })
            .populate('challenge')
            .populate('inviter')
            .populate('receiver')
            .sort({ createdAt: -1 });
    }

    async findUserSentInvitations(userId: string): Promise<ChallengeInvitation[]> {
        if (!isValidObjectId(userId)) {
            return [];
        }
        return this.challengeInvitationModel.find({
            inviter: userId
        })
            .populate('challenge')
            .populate('inviter')
            .populate('receiver')
            .sort({ createdAt: -1 });
    }

    async findChallengeInvitations(challengeId: string): Promise<ChallengeInvitation[]> {
        if (!isValidObjectId(challengeId)) {
            return [];
        }
        return this.challengeInvitationModel.find({
            challenge: challengeId
        })
            .populate('challenge')
            .populate('inviter')
            .populate('receiver')
            .sort({ createdAt: -1 });
    }

    async acceptInvitation(invitationId: string): Promise<ChallengeInvitation | null> {
        if (!isValidObjectId(invitationId)) {
            return null;
        }
        return this.challengeInvitationModel.findByIdAndUpdate(
            invitationId,
            { status: InvitationStatus.ACCEPTED },
            { new: true }
        )
            .populate('challenge')
            .populate('inviter')
            .populate('receiver');
    }

    async declineInvitation(invitationId: string): Promise<ChallengeInvitation | null> {
        if (!isValidObjectId(invitationId)) {
            return null;
        }
        return this.challengeInvitationModel.findByIdAndUpdate(
            invitationId,
            { status: InvitationStatus.DECLINED },
            { new: true }
        )
            .populate('challenge')
            .populate('inviter')
            .populate('receiver');
    }

    async expireOldInvitations(): Promise<void> {
        await this.challengeInvitationModel.updateMany(
            {
                status: InvitationStatus.PENDING,
                expiresAt: { $lt: new Date() }
            },
            { status: InvitationStatus.EXPIRED }
        );
    }

    async deleteInvitation(invitationId: string): Promise<void> {
        if (!isValidObjectId(invitationId)) {
            return;
        }
        await this.challengeInvitationModel.deleteOne({ _id: invitationId });
    }

    async canUserInvite(inviterId: string, challengeId: string): Promise<boolean> {
        if (!isValidObjectId(inviterId) || !isValidObjectId(challengeId)) {
            return false;
        }
        
        // Check if user is already participating in the challenge
        // This would require access to ChallengeParticipationService
        // For now, we'll assume they can invite if they have a valid session
        return true;
    }
}