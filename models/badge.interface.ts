import { BadgeRule } from "./badge-rule.interface";
import {Timestamps} from "./timestamps";
import {User} from "./user.interface";

export enum BadgeRarity {
    COMMON = 'COMMON',
    RARE = 'RARE',
    EPIC = 'EPIC',
    LEGENDARY = 'LEGENDARY'
}

export interface Badge extends Timestamps {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    rules: BadgeRule[];
    isActive: boolean;
    rarity: BadgeRarity;
}