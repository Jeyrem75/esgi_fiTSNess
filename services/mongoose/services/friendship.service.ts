import {Mongoose, Model, isValidObjectId} from "mongoose";
import {Friendship, FriendshipStatus} from "../../../models";
import {friendshipSchema} from "../schema";

export type CreateFriendship = Omit<Friendship, '_id' | 'createdAt' | 'updatedAt'>;

export class FriendshipService {
    readonly friendshipModel: Model<Friendship>;

    constructor(public readonly connection: Mongoose) {
        this.friendshipModel = connection.model('Friendship', friendshipSchema());
    }

    async sendFriendRequest(requesterId: string, addresseeId: string): Promise<Friendship> {
        return this.friendshipModel.create({
            requester: requesterId,
            addressee: addresseeId,
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
                { requester: userId1, addressee: userId2 },
                { requester: userId2, addressee: userId1 }
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
                { addressee: userId, status: FriendshipStatus.ACCEPTED }
            ]
        }).populate('requester').populate('addressee');
    }

    async findPendingRequests(userId: string): Promise<Friendship[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.friendshipModel.find({
            addressee: userId,
            status: FriendshipStatus.PENDING
        }).populate('requester').populate('addressee');
    }

    async findSentRequests(userId: string): Promise<Friendship[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.friendshipModel.find({
            requester: userId,
            status: FriendshipStatus.PENDING
        }).populate('requester').populate('addressee');
    }

    async areFriends(userId1: string, userId2: string): Promise<boolean> {
        if(!isValidObjectId(userId1) || !isValidObjectId(userId2)) {
            return false;
        }
        const friendship = await this.friendshipModel.findOne({
            $or: [
                { requester: userId1, addressee: userId2, status: FriendshipStatus.ACCEPTED },
                { requester: userId2, addressee: userId1, status: FriendshipStatus.ACCEPTED }
            ]
        });
        return !!friendship;
    }
}