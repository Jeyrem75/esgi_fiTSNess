import {Mongoose, Model, isValidObjectId} from "mongoose";
import {Friendship, FriendshipStatus} from "../../../models";
import {friendshipSchema} from "../schema";

export type CreateFriendship = Omit<Friendship, '_id' | 'createdAt' | 'updatedAt'>;

export class FriendshipService {
    readonly friendshipModel: Model<Friendship>;

    constructor(public readonly connection: Mongoose) {
        this.friendshipModel = connection.model('Friendship', friendshipSchema());
    }

    async sendFriendRequest(requesterId: string, receiverId: string): Promise<Friendship> {
        return this.friendshipModel.create({
            requester: requesterId,
            receiver: receiverId,
            status: FriendshipStatus.PENDING
        });
    }

    async acceptFriendRequest(friendshipId: string): Promise<void> {
        if(!isValidObjectId(friendshipId)) {
            return;
        }
        await this.friendshipModel.updateOne(
            { _id: friendshipId },
            { status: FriendshipStatus.ACCEPTED }
        );
    }

    async declineFriendRequest(friendshipId: string): Promise<void> {
        if(!isValidObjectId(friendshipId)) {
            return;
        }
        await this.friendshipModel.updateOne(
            { _id: friendshipId },
            { status: FriendshipStatus.DECLINED }
        );
    }

    async blockUser(friendshipId: string): Promise<void> {
        if(!isValidObjectId(friendshipId)) {
            return;
        }
        await this.friendshipModel.updateOne(
            { _id: friendshipId },
            { status: FriendshipStatus.BLOCKED }
        );
    }

    async removeFriend(userId1: string, userId2: string): Promise<void> {
        if(!isValidObjectId(userId1) || !isValidObjectId(userId2)) {
            return;
        }
        await this.friendshipModel.deleteMany({
            $or: [
                { requester: userId1, receiver: userId2 },
                { requester: userId2, receiver: userId1 }
            ]
        });
    }

    async findUserFriends(userId: string): Promise<Friendship[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.friendshipModel.find({
            $or: [
                { requester: userId, status: FriendshipStatus.ACCEPTED },
                { receiver: userId, status: FriendshipStatus.ACCEPTED }
            ]
        }).populate('requester').populate('receiver');
    }

    async findPendingRequests(userId: string): Promise<Friendship[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.friendshipModel.find({
            receiver: userId,
            status: FriendshipStatus.PENDING
        }).populate('requester').populate('receiver');
    }

    async findSentRequests(userId: string): Promise<Friendship[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.friendshipModel.find({
            requester: userId,
            status: FriendshipStatus.PENDING
        }).populate('requester').populate('receiver');
    }

    async areFriends(userId1: string, userId2: string): Promise<boolean> {
        if(!isValidObjectId(userId1) || !isValidObjectId(userId2)) {
            return false;
        }
        const friendship = await this.friendshipModel.findOne({
            $or: [
                { requester: userId1, receiver: userId2, status: FriendshipStatus.ACCEPTED },
                { requester: userId2, receiver: userId1, status: FriendshipStatus.ACCEPTED }
            ]
        });
        return !!friendship;
    }
}