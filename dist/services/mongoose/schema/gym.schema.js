"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gymSchema = gymSchema;
const mongoose_1 = require("mongoose");
const models_1 = require("../../../models");
const address_schema_1 = require("./address.schema");
function gymSchema() {
    return new mongoose_1.Schema({
        name: {
            type: String,
            required: true
        },
        address: {
            type: (0, address_schema_1.addressSchema)(),
            required: true
        },
        phone: {
            type: String
        },
        description: {
            type: String
        },
        equipment: [{
                type: String
            }],
        activities: [{
                type: String
            }],
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        owner: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: Object.values(models_1.GymStatus),
            default: models_1.GymStatus.PENDING
        },
        images: [{
                type: String
            }]
    }, {
        timestamps: true,
        collection: "gyms",
        versionKey: false,
    });
}
