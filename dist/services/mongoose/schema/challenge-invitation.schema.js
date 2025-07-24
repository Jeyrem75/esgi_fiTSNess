"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.challengeInvitationSchema = challengeInvitationSchema;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
function challengeInvitationSchema() {
    return new mongoose_1.Schema({
        challenge: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Challenge',
            required: true
        },
        inviter: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(models_1.InvitationStatus),
            default: models_1.InvitationStatus.PENDING
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
