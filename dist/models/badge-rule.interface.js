"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeOperator = exports.BadgeRuleType = void 0;
var BadgeRuleType;
(function (BadgeRuleType) {
    BadgeRuleType["CHALLENGES_COMPLETED"] = "CHALLENGES_COMPLETED";
    BadgeRuleType["WORKOUTS_COMPLETED"] = "WORKOUTS_COMPLETED";
    BadgeRuleType["CALORIES_BURNED"] = "CALORIES_BURNED";
    BadgeRuleType["DAYS_ACTIVE"] = "DAYS_ACTIVE";
    BadgeRuleType["FRIENDS_INVITED"] = "FRIENDS_INVITED";
    BadgeRuleType["GYMS_VISITED"] = "GYMS_VISITED";
})(BadgeRuleType || (exports.BadgeRuleType = BadgeRuleType = {}));
var BadgeOperator;
(function (BadgeOperator) {
    BadgeOperator["GREATER_THAN"] = "GREATER_THAN";
    BadgeOperator["GREATER_THAN_OR_EQUAL"] = "GREATER_THAN_OR_EQUAL";
    BadgeOperator["EQUAL"] = "EQUAL";
    BadgeOperator["LESS_THAN"] = "LESS_THAN";
    BadgeOperator["LESS_THAN_OR_EQUAL"] = "LESS_THAN_OR_EQUAL";
})(BadgeOperator || (exports.BadgeOperator = BadgeOperator = {}));
