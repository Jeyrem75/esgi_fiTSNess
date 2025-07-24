export enum RewardType {
    POINTS = 'POINTS',
    BADGE = 'BADGE',
    DISCOUNT = 'DISCOUNT',
    FREE_SESSION = 'FREE_SESSION'
}

export interface ChallengeReward {
    type: RewardType;
    value: number;
    description: string;
}