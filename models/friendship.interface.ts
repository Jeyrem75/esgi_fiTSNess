import {Timestamps} from "./timestamps";
import {User} from "./user.interface";

export enum FriendshipStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    BLOCKED = 'BLOCKED'
}

export interface Friendship extends Timestamps {
    _id: string;
    requester: string | User;
    receiver: string | User;
    status: FriendshipStatus;
}