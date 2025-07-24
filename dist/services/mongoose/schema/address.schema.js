"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressSchema = addressSchema;
const mongoose_1 = require("mongoose");
function addressSchema() {
    return new mongoose_1.Schema({
        streetNumber: {
            type: String,
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: 'France'
        }
    }, {
        _id: false,
    });
}
