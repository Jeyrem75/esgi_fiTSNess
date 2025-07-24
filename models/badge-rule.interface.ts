export enum BadgeRuleType {
    CHALLENGES_COMPLETED = 'CHALLENGES_COMPLETED',
    WORKOUTS_COMPLETED = 'WORKOUTS_COMPLETED',
    CALORIES_BURNED = 'CALORIES_BURNED',
    DAYS_ACTIVE = 'DAYS_ACTIVE',
    FRIENDS_INVITED = 'FRIENDS_INVITED',
    GYMS_VISITED = 'GYMS_VISITED'
}

export enum BadgeOperator {
    GREATER_THAN = 'GREATER_THAN',
    GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
    EQUAL = 'EQUAL',
    LESS_THAN = 'LESS_THAN',
    LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL'
}

export interface BadgeRule {
    type: BadgeRuleType;
    value: number;
    operator: BadgeOperator;
    field: string;
}