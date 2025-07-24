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
exports.sessionMiddleware = sessionMiddleware;
function sessionMiddleware(sessionService) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        const session = yield sessionService.findActiveSession(token);
        if (!session) {
            res.status(401).end();
            return;
        }
        req.session = session;
        req.user = session.user;
        next();
    });
}
