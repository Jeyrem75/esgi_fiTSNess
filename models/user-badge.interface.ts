import { Badge } from "./badge.interface";
import { Timestamps } from "./timestamps";
import { User } from "./user.interface";

export interface UserBadge extends Timestamps {
    _id: string;
    user: string | User;
    badge: string | Badge;
    earnedAt: Date;
}