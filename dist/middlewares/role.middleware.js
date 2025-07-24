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
exports.roleMiddleware = roleMiddleware;
const models_1 = require("../models");
function roleMiddleware(role) {
    const targetRoleLevel = (0, models_1.getUserRoleLevel)(role);
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (!req.user) {
            res.status(401).end();
            return;
        }
        if ((0, models_1.getUserRoleLevel)(req.user.role) < targetRoleLevel) {
            res.status(403).end();
            return;
        }
        next();
    });
}
