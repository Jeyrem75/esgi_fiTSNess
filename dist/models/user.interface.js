"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemperatureUnit = exports.DistanceUnit = exports.WeightUnit = exports.FriendsListVisibility = exports.WorkoutVisibility = exports.ProfileVisibility = exports.FitnessLevel = exports.UserRole = void 0;
exports.getUserRoleLevel = getUserRoleLevel;
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    UserRole["GYM_OWNER"] = "GYM_OWNER";
    UserRole["USER"] = "USER";
})(UserRole || (exports.UserRole = UserRole = {}));
var FitnessLevel;
(function (FitnessLevel) {
    FitnessLevel["BEGINNER"] = "BEGINNER";
    FitnessLevel["INTERMEDIATE"] = "INTERMEDIATE";
    FitnessLevel["ADVANCED"] = "ADVANCED";
    FitnessLevel["EXPERT"] = "EXPERT";
})(FitnessLevel || (exports.FitnessLevel = FitnessLevel = {}));
function getUserRoleLevel(role) {
    switch (role) {
        case UserRole.SUPER_ADMIN:
            return 999;
        case UserRole.GYM_OWNER:
            return 100;
        default:
            return 1;
    }
}
var ProfileVisibility;
(function (ProfileVisibility) {
    ProfileVisibility["PUBLIC"] = "PUBLIC";
    ProfileVisibility["FRIENDS_ONLY"] = "FRIENDS_ONLY";
    ProfileVisibility["PRIVATE"] = "PRIVATE";
})(ProfileVisibility || (exports.ProfileVisibility = ProfileVisibility = {}));
var WorkoutVisibility;
(function (WorkoutVisibility) {
    WorkoutVisibility["PUBLIC"] = "PUBLIC";
    WorkoutVisibility["FRIENDS_ONLY"] = "FRIENDS_ONLY";
    WorkoutVisibility["PRIVATE"] = "PRIVATE";
})(WorkoutVisibility || (exports.WorkoutVisibility = WorkoutVisibility = {}));
var FriendsListVisibility;
(function (FriendsListVisibility) {
    FriendsListVisibility["PUBLIC"] = "PUBLIC";
    FriendsListVisibility["FRIENDS_ONLY"] = "FRIENDS_ONLY";
    FriendsListVisibility["PRIVATE"] = "PRIVATE";
})(FriendsListVisibility || (exports.FriendsListVisibility = FriendsListVisibility = {}));
var WeightUnit;
(function (WeightUnit) {
    WeightUnit["KG"] = "KG";
    WeightUnit["LB"] = "LB";
})(WeightUnit || (exports.WeightUnit = WeightUnit = {}));
var DistanceUnit;
(function (DistanceUnit) {
    DistanceUnit["KM"] = "KM";
    DistanceUnit["MI"] = "MI";
})(DistanceUnit || (exports.DistanceUnit = DistanceUnit = {}));
var TemperatureUnit;
(function (TemperatureUnit) {
    TemperatureUnit["CELSIUS"] = "CELSIUS";
    TemperatureUnit["FAHRENHEIT"] = "FAHRENHEIT";
})(TemperatureUnit || (exports.TemperatureUnit = TemperatureUnit = {}));
