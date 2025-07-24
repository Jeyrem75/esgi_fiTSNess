import { TemperatureUnit, DistanceUnit, WeightUnit } from './../models/user.interface';
import {SessionService, UserService} from "../services/mongoose";
import {json, Request, Response, Router} from "express";
import {sessionMiddleware} from "../middlewares";
import {FriendsListVisibility, ProfileVisibility, UserRole, WorkoutVisibility} from "../models";

export class AuthController {

    constructor(public readonly userService: UserService,
                public readonly sessionService: SessionService) {
    }

    async login(req: Request, res: Response) {
        if(!req.body || !req.body.email || !req.body.password) {
            res.status(400).end();
            return;
        }
        const user = await this.userService.findUser(req.body.email, req.body.password);
        if(!user || !user.isActive) {
            res.status(401).end();
            return;
        }
        const session = await this.sessionService.createSession({
            user: user,
            expirationDate: new Date(Date.now() + 1_296_000_000)
        });
        res.status(201).json(session);
    }

    async me(req: Request, res: Response) {
        res.json(req.user);
    }

    async subscribe(req: Request, res: Response) {
        if(!req.body || !req.body.email || !req.body.password
            || !req.body.lastName || !req.body.firstName) {
            res.status(400).end();
            return;
        }
        try {
            const user = await this.userService.createUser({
                email: req.body.email,
                role: UserRole.USER,
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

    buildRouter(): Router {
        const router = Router();
        router.post('/login', json(), this.login.bind(this));
        router.post('/subscribe', json(), this.subscribe.bind(this));
        router.get('/me',
            sessionMiddleware(this.sessionService),
            this.me.bind(this));
        return router;
    }
}