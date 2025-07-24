import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import {User, UserRole} from "../../../models";
import {userSchema} from "../schema";
import {sha256} from "../../../utils";

export type CreateUser = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;

export class UserService {

    readonly userModel: Model<User>;

    constructor(public readonly connection: Mongoose) {
        this.userModel = connection.model('User', userSchema());
    }

    async findUser(email: string, password?: string): Promise<User | null> {
        const filter: FilterQuery<User> = {email: email};
        if(password) {
            filter.password = sha256(password);
        }
        return this.userModel.findOne(filter);
    }

    async findUserById(userId: string): Promise<User | null> {
        if(!isValidObjectId(userId)) {
            return null;
        }
        return this.userModel.findById(userId);
    }

    async findUsers(filter: FilterQuery<User> = {}): Promise<User[]> {
        return this.userModel.find(filter);
    }

    async createUser(user: CreateUser): Promise<User> {
        return this.userModel.create({...user, password: sha256(user.password)});
    }

    async updateUser(userId: string, update: Partial<CreateUser>): Promise<User | null> {
        if(!isValidObjectId(userId)) {
            return null;
        }
        if (update.password) {
            update.password = sha256(update.password);
        }
        return this.userModel.findByIdAndUpdate(userId, update, { new: true });
    }

    async updateRole(userId: string, role: UserRole): Promise<void> {
        if(!isValidObjectId(userId)) {
            return;
        }
        await this.userModel.updateOne({
            _id: userId
        }, {
            role: role
        });
    }

    async deactivateUser(userId: string): Promise<void> {
        if(!isValidObjectId(userId)) {
            return;
        }
        await this.userModel.updateOne({
            _id: userId
        }, {
            isActive: false
        });
    }

    async reactivateUser(userId: string): Promise<void> {
        if(!isValidObjectId(userId)) {
            return;
        }
        await this.userModel.updateOne({
            _id: userId
        }, {
            isActive: true
        });
    }

    async deleteUser(userId: string): Promise<void> {
        if(!isValidObjectId(userId)) {
            return;
        }
        await this.userModel.deleteOne({ _id: userId });
    }

    async updateScore(userId: string, scoreIncrement: number): Promise<void> {
        if(!isValidObjectId(userId)) {
            return;
        }
        await this.userModel.updateOne({
            _id: userId
        }, {
            $inc: { totalScore: scoreIncrement }
        });
    }

    async searchUsers(query: string): Promise<User[]> {
        return this.userModel.find({
            $or: [
                { firstName: { $regex: query, $options: 'i' } },
                { lastName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            isActive: true
        });
    }
}