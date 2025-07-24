"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendshipSchema = friendshipSchema;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
function friendshipSchema() {
    return new mongoose_1.Schema({
        requester: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        receiver: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(models_1.FriendshipStatus),
            default: models_1.FriendshipStatus.PENDING
        }
    }, {
        timestamps: true,
        collection: "friendships",
        versionKey: false,
    });
}
