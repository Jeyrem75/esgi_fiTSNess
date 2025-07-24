"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeSchema = badgeSchema;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
const badgeRuleSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: Object.values(models_1.BadgeRuleType)
    },
    value: {
        type: Number,
        required: true
    },
    operator: {
        type: String,
        required: true,
        enum: Object.values(models_1.BadgeOperator)
    },
    field: {
        type: String,
        required: true
    }
}, { _id: false });
function badgeSchema() {
    return new mongoose_1.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String
        },
        rules: [badgeRuleSchema],
        isActive: {
            type: Boolean,
            default: true
        },
        rarity: {
            type: String,
            required: true,
            enum: Object.values(models_1.BadgeRarity)
        }
    }, {
        timestamps: true,
        collection: "badges",
        versionKey: false,
    });
}
