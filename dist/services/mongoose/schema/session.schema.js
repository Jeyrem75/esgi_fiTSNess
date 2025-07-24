"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionSchema = sessionSchema;
const mongoose_1 = require("mongoose");
function sessionSchema() {
    return new mongoose_1.Schema({
        expirationDate: {
            type: Date,
        },
        user: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }, {
        timestamps: true,
        collection: "sessions",
        versionKey: false,
    });
}
