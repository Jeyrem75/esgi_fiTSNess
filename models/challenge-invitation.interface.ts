import { Timestamps } from "./timestamps";
import { User } from "./user.interface";
import { Challenge } from "./challenge.interface";

export enum InvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    EXPIRED = 'EXPIRED'
}

export interface ChallengeInvitation extends Timestamps {
    _id: string;
    challenge: string | Challenge;
    inviter: string | User;
    receiver: string | User;
    status: InvitationStatus;
    message?: string;
    expiresAt: Date;
}