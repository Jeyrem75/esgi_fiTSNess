import { WeightUnit, DistanceUnit, TemperatureUnit } from './../models/user.interface';
import {SessionService, UserService} from "../services/mongoose";
import {Request, Response, Router, json} from "express";
import {roleMiddleware, sessionMiddleware} from "../middlewares";
import {FriendsListVisibility, ProfileVisibility, UserRole, WorkoutVisibility} from "../models";

export class UserController {
    constructor(public readonly userService: UserService,
                public readonly sessionService: SessionService) {
    }

    async createUser(req: Request, res: Response) {
        if(!req.body || !req.body.email || !req.body.password
            || !req.body.lastName || !req.body.firstName || !req.body.role) {
            res.status(400).end();
            return;
        }
        try {
            const user = await this.userService.createUser({
                email: req.body.email,
                role: req.body.role,
                password: req.body.password,
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                isActive: true,
                profileImage: req.body.profileImage,
                dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
                height: req.body.height,
                weight: req.body.weight,
                fitnessLevel: req.body.fitnessLevel,
                goals: req.body.goals || [],
                totalScore: 0,
                preferences: {
                    notifications: {
                        challengeInvites: true,
                        friendRequests: true,
                        achievements: true,
                        workoutReminders: true,
                        challengeUpdates: true
                    },
                    privacy: {
                        profileVisibility: ProfileVisibility.PUBLIC,
                        workoutVisibility: WorkoutVisibility.FRIENDS_ONLY,
                        friendsListVisibility: FriendsListVisibility.FRIENDS_ONLY
                    },
                    units: {
                        weight: WeightUnit.KG,
                        distance: DistanceUnit.KM,
                        temperature: TemperatureUnit.CELSIUS
                    }
                }
            });
            res.status(201).json(user);
        } catch {
            res.status(409).end();
        }
    }

    async getUsers(req: Request, res: Response) {
        const { role, active } = req.query;
        let filter: any = {};
        if (role) filter.role = role;
        if (active !== undefined) filter.isActive = active === 'true';
        
        const users = await this.userService.findUsers(filter);
        res.json(users);
    }

    async getUserById(req: Request, res: Response) {
        const user = await this.userService.findUserById(req.params.id);
        if (!user) {
            res.status(404).end();
            return;
        }
        res.json(user);
    }

    async updateUser(req: Request, res: Response) {
        const userId = req.params.id;
        if (req.user!.role !== UserRole.SUPER_ADMIN && userId !== req.user!._id) {
            res.status(403).end();
            return;
        }
        const user = await this.userService.updateUser(userId, req.body);
        if (!user) {
            res.status(404).end();
            return;
        }
        res.json(user);
    }

    async updateMyProfile(req: Request, res: Response) {
        const user = await this.userService.updateUser(req.user!._id, req.body);
        res.json(user);
    }

    async promoteUser(req: Request, res: Response) {
        const userId = req.params.id;
        await this.userService.updateRole(userId, UserRole.GYM_OWNER);
        res.status(204).end();
    }

    async demoteUser(req: Request, res: Response) {
        const userId = req.params.id;
        await this.userService.updateRole(userId, UserRole.USER);
        res.status(204).end();
    }

    async deactivateUser(req: Request, res: Response) {
        await this.userService.deactivateUser(req.params.id);
        res.status(204).end();
    }

    async reactivateUser(req: Request, res: Response) {
        await this.userService.reactivateUser(req.params.id);
        res.status(204).end();
    }

    async deleteUser(req: Request, res: Response) {
        await this.userService.deleteUser(req.params.id);
        res.status(204).end();
    }

    async searchUsers(req: Request, res: Response) {
        const { query } = req.query;
        if (!query) {
            res.status(400).end();
            return;
        }
        const users = await this.userService.searchUsers(query as string);
        res.json(users);
    }

    buildRouter(): Router {
        const router = Router();
        router.post('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            json(),
            this.createUser.bind(this));
        router.get('/',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.getUsers.bind(this));
        router.get('/search',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            this.searchUsers.bind(this));
        router.get('/:id',
            sessionMiddleware(this.sessionService),
            this.getUserById.bind(this));
        router.put('/my/profile',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.updateMyProfile.bind(this));
        router.put('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.USER),
            json(),
            this.updateUser.bind(this));
        router.patch('/:id/promote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.promoteUser.bind(this));
        router.patch('/:id/demote',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.demoteUser.bind(this));
        router.patch('/:id/deactivate',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deactivateUser.bind(this));
        router.patch('/:id/reactivate',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.reactivateUser.bind(this));
        router.delete('/:id',
            sessionMiddleware(this.sessionService),
            roleMiddleware(UserRole.SUPER_ADMIN),
            this.deleteUser.bind(this));
        return router;
    }
}