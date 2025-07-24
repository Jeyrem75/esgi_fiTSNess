"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openConnection = openConnection;
const mongoose_1 = require("mongoose");
function openConnection() {
    if (typeof process.env.MONGO_URI === 'undefined') {
        throw new Error('MONGO_URI is not defined');
    }
    if (typeof process.env.MONGO_USERNAME === 'undefined') {
        throw new Error('MONGO_USERNAME is not defined');
    }
    if (typeof process.env.MONGO_PASSWORD === 'undefined') {
        throw new Error('MONGO_PASSWORD is not defined');
    }
    if (typeof process.env.MONGO_DB_NAME === 'undefined') {
        throw new Error('MONGO_DB_NAME is not defined');
    }
    return (0, mongoose_1.connect)(process.env.MONGO_URI, {
        auth: {
            username: process.env.MONGO_USERNAME,
            password: process.env.MONGO_PASSWORD,
        },
        authSource: 'admin',
        dbName: process.env.MONGO_DB_NAME
    });
}
