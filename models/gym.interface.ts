import {Timestamps} from "./timestamps";
import {User} from "./user.interface";
import {Address} from "./address.interface";

export enum GymStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface Gym extends Timestamps {
    _id: string;
    name: string;
    address: Address;
    phone?: string;
    description?: string;
    equipment: string[];
    activities: string[];
    capacity: number;
    owner: string | User;
    status: GymStatus;
    images?: string[];
}