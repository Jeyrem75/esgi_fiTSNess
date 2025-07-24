"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
class SessionService {
    constructor(connection) {
        this.connection = connection;
        this.sessionModel = connection.model('Session', (0, schema_1.sessionSchema)());
    }
    createSession(session) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sessionModel.create(session);
        });
    }
    findActiveSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(sessionId)) {
                return null;
            }
            const session = this.sessionModel.findOne({
                _id: sessionId,
            }).populate('user');
            return session;
        });
    }
}
exports.SessionService = SessionService;
