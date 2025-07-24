import {Schema} from "mongoose";
import {Badge, BadgeRarity, BadgeRuleType, BadgeOperator} from "../../../models";

const badgeRuleSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: Object.values(BadgeRuleType)
    },
    value: {
        type: Number,
        required: true
    },
    operator: {
        type: String,
        required: true,
        enum: Object.values(BadgeOperator)
    },
    field: {
        type: String,
        required: true
    }
}, { _id: false });

export function badgeSchema(): Schema<Badge> {
    return new Schema<Badge>({
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
            enum: Object.values(BadgeRarity)
        }
    }, {
        timestamps: true,
        collection: "badges",
        versionKey: false,
    });
}