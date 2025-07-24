import { Schema } from "mongoose";
import { ChallengeInvitation, InvitationStatus } from "../../../models";

export function challengeInvitationSchema(): Schema<ChallengeInvitation> {
    return new Schema<ChallengeInvitation>({
        challenge: {
            type: Schema.Types.ObjectId,
            ref: 'Challenge',
            required: true
        },
        inviter: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(InvitationStatus),
            default: InvitationStatus.PENDING
        },
        message: {
            type: String
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    }, {
        timestamps: true,
        collection: "challengeInvitations",
        versionKey: false,
    });
}