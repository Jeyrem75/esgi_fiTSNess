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
exports.ChallengeInvitationService = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
const schema_1 = require("../schema");
class ChallengeInvitationService {
    constructor(connection) {
        this.connection = connection;
        this.challengeInvitationModel = connection.model('ChallengeInvitation', (0, schema_1.challengeInvitationSchema)());
    }
    createInvitation(invitation) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingInvitation = yield this.challengeInvitationModel.findOne({
                challenge: invitation.challenge,
                inviter: invitation.inviter,
                receiver: invitation.receiver,
                status: models_1.InvitationStatus.PENDING
            });
            if (existingInvitation) {
                throw new Error('Invitation already exists');
            }
            return this.challengeInvitationModel.create(invitation);
        });
    }
    findInvitationById(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(invitationId)) {
                return null;
            }
            return this.challengeInvitationModel.findById(invitationId)
                .populate('challenge')
                .populate('inviter')
                .populate('receiver');
        });
    }
    findUserPendingInvitations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.challengeInvitationModel.find({
                receiver: userId,
                status: models_1.InvitationStatus.PENDING,
                expiresAt: { $gt: new Date() }
            })
                .populate('challenge')
                .populate('inviter')
                .populate('receiver')
                .sort({ createdAt: -1 });
        });
    }
    findUserSentInvitations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.challengeInvitationModel.find({
                inviter: userId
            })
                .populate('challenge')
                .populate('inviter')
                .populate('receiver')
                .sort({ createdAt: -1 });
        });
    }
    findChallengeInvitations(challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(challengeId)) {
                return [];
            }
            return this.challengeInvitationModel.find({
                challenge: challengeId
            })
                .populate('challenge')
                .populate('inviter')
                .populate('receiver')
                .sort({ createdAt: -1 });
        });
    }
    acceptInvitation(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(invitationId)) {
                return null;
            }
            return this.challengeInvitationModel.findByIdAndUpdate(invitationId, { status: models_1.InvitationStatus.ACCEPTED }, { new: true })
                .populate('challenge')
                .populate('inviter')
                .populate('receiver');
        });
    }
    declineInvitation(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(invitationId)) {
                return null;
            }
            return this.challengeInvitationModel.findByIdAndUpdate(invitationId, { status: models_1.InvitationStatus.DECLINED }, { new: true })
                .populate('challenge')
                .populate('inviter')
                .populate('receiver');
        });
    }
    expireOldInvitations() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.challengeInvitationModel.updateMany({
                status: models_1.InvitationStatus.PENDING,
                expiresAt: { $lt: new Date() }
            }, { status: models_1.InvitationStatus.EXPIRED });
        });
    }
    deleteInvitation(invitationId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(invitationId)) {
                return;
            }
            yield this.challengeInvitationModel.deleteOne({ _id: invitationId });
        });
    }
    canUserInvite(inviterId, challengeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(inviterId) || !(0, mongoose_1.isValidObjectId)(challengeId)) {
                return false;
            }
            // Check if user is already participating in the challenge
            // This would require access to ChallengeParticipationService
            // For now, we'll assume they can invite if they have a valid session
            return true;
        });
    }
}
exports.ChallengeInvitationService = ChallengeInvitationService;
