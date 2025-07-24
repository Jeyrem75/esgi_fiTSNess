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
exports.FriendshipService = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
const schema_1 = require("../schema");
class FriendshipService {
    constructor(connection) {
        this.connection = connection;
        this.friendshipModel = connection.model('Friendship', (0, schema_1.friendshipSchema)());
    }
    sendFriendRequest(requesterId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.friendshipModel.create({
                requester: requesterId,
                receiver: receiverId,
                status: models_1.FriendshipStatus.PENDING
            });
        });
    }
    acceptFriendRequest(friendshipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(friendshipId)) {
                return;
            }
            yield this.friendshipModel.updateOne({ _id: friendshipId }, { status: models_1.FriendshipStatus.ACCEPTED });
        });
    }
    declineFriendRequest(friendshipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(friendshipId)) {
                return;
            }
            yield this.friendshipModel.updateOne({ _id: friendshipId }, { status: models_1.FriendshipStatus.DECLINED });
        });
    }
    blockUser(friendshipId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(friendshipId)) {
                return;
            }
            yield this.friendshipModel.updateOne({ _id: friendshipId }, { status: models_1.FriendshipStatus.BLOCKED });
        });
    }
    removeFriend(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId1) || !(0, mongoose_1.isValidObjectId)(userId2)) {
                return;
            }
            yield this.friendshipModel.deleteMany({
                $or: [
                    { requester: userId1, receiver: userId2 },
                    { requester: userId2, receiver: userId1 }
                ]
            });
        });
    }
    findUserFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.friendshipModel.find({
                $or: [
                    { requester: userId, status: models_1.FriendshipStatus.ACCEPTED },
                    { receiver: userId, status: models_1.FriendshipStatus.ACCEPTED }
                ]
            }).populate('requester').populate('receiver');
        });
    }
    findPendingRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.friendshipModel.find({
                receiver: userId,
                status: models_1.FriendshipStatus.PENDING
            }).populate('requester').populate('receiver');
        });
    }
    findSentRequests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return [];
            }
            return this.friendshipModel.find({
                requester: userId,
                status: models_1.FriendshipStatus.PENDING
            }).populate('requester').populate('receiver');
        });
    }
    areFriends(userId1, userId2) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId1) || !(0, mongoose_1.isValidObjectId)(userId2)) {
                return false;
            }
            const friendship = yield this.friendshipModel.findOne({
                $or: [
                    { requester: userId1, receiver: userId2, status: models_1.FriendshipStatus.ACCEPTED },
                    { requester: userId2, receiver: userId1, status: models_1.FriendshipStatus.ACCEPTED }
                ]
            });
            return !!friendship;
        });
    }
}
exports.FriendshipService = FriendshipService;
