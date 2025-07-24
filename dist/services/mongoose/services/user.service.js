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
exports.UserService = void 0;
const mongoose_1 = require("mongoose");
const schema_1 = require("../schema");
const utils_1 = require("../../../utils");
class UserService {
    constructor(connection) {
        this.connection = connection;
        this.userModel = connection.model('User', (0, schema_1.userSchema)());
    }
    findUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { email: email };
            if (password) {
                filter.password = (0, utils_1.sha256)(password);
            }
            return this.userModel.findOne(filter);
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return null;
            }
            return this.userModel.findById(userId);
        });
    }
    findUsers() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            return this.userModel.find(filter);
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userModel.create(Object.assign(Object.assign({}, user), { password: (0, utils_1.sha256)(user.password) }));
        });
    }
    updateUser(userId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return null;
            }
            if (update.password) {
                update.password = (0, utils_1.sha256)(update.password);
            }
            return this.userModel.findByIdAndUpdate(userId, update, { new: true });
        });
    }
    updateRole(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return;
            }
            yield this.userModel.updateOne({
                _id: userId
            }, {
                role: role
            });
        });
    }
    deactivateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return;
            }
            yield this.userModel.updateOne({
                _id: userId
            }, {
                isActive: false
            });
        });
    }
    reactivateUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return;
            }
            yield this.userModel.updateOne({
                _id: userId
            }, {
                isActive: true
            });
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return;
            }
            yield this.userModel.deleteOne({ _id: userId });
        });
    }
    updateScore(userId, scoreIncrement) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                return;
            }
            yield this.userModel.updateOne({
                _id: userId
            }, {
                $inc: { totalScore: scoreIncrement }
            });
        });
    }
    searchUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userModel.find({
                $or: [
                    { firstName: { $regex: query, $options: 'i' } },
                    { lastName: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ],
                isActive: true
            });
        });
    }
}
exports.UserService = UserService;
