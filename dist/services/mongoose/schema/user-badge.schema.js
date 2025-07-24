"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userBadgeSchema = userBadgeSchema;
const mongoose_1 = require("mongoose");
function userBadgeSchema() {
    return new mongoose_1.Schema({
        user: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        badge: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Badge',
            required: true
        },
        earnedAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    }, {
        timestamps: true,
        collection: "userBadges",
        versionKey: false,
    });
}
