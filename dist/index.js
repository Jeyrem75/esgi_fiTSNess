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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("./services/mongoose");
const models_1 = require("./models");
const controllers_1 = require("./controllers");
(0, dotenv_1.config)();
function startAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield (0, mongoose_1.openConnection)();
        const userService = new mongoose_1.UserService(connection);
        const sessionService = new mongoose_1.SessionService(connection);
        const gymService = new mongoose_1.GymService(connection);
        const exerciseService = new mongoose_1.ExerciseService(connection);
        const challengeService = new mongoose_1.ChallengeService(connection);
        const badgeService = new mongoose_1.BadgeService(connection);
        const userBadgeService = new mongoose_1.UserBadgeService(connection);
        const workoutService = new mongoose_1.WorkoutService(connection);
        const challengeParticipationService = new mongoose_1.ChallengeParticipationService(connection);
        const challengeInvitationService = new mongoose_1.ChallengeInvitationService(connection);
        const friendshipService = new mongoose_1.FriendshipService(connection);
        const leaderboardService = new mongoose_1.LeaderboardService(connection);
        yield bootstrapAPI(userService, gymService, exerciseService, challengeService, badgeService, workoutService, friendshipService);
        const app = (0, express_1.default)();
        const authController = new controllers_1.AuthController(userService, sessionService);
        const userController = new controllers_1.UserController(userService, sessionService);
        const gymController = new controllers_1.GymController(gymService, sessionService);
        const exerciseController = new controllers_1.ExerciseController(exerciseService, sessionService);
        const challengeController = new controllers_1.ChallengeController(challengeService, sessionService);
        const badgeController = new controllers_1.BadgeController(badgeService, sessionService);
        const userBadgeController = new controllers_1.UserBadgeController(userBadgeService, badgeService, workoutService, challengeParticipationService, sessionService);
        const workoutController = new controllers_1.WorkoutController(workoutService, sessionService);
        const challengeParticipationController = new controllers_1.ChallengeParticipationController(challengeParticipationService, challengeService, userBadgeService, badgeService, workoutService, sessionService);
        const challengeInvitationController = new controllers_1.ChallengeInvitationController(challengeInvitationService, challengeService, friendshipService, challengeParticipationService, sessionService);
        const friendshipController = new controllers_1.FriendshipController(friendshipService, sessionService);
        const leaderboardController = new controllers_1.LeaderboardController(leaderboardService, challengeParticipationService, sessionService);
        app.use('/auth', authController.buildRouter());
        app.use('/users', userController.buildRouter());
        app.use('/gyms', gymController.buildRouter());
        app.use('/exercises', exerciseController.buildRouter());
        app.use('/challenges', challengeController.buildRouter());
        app.use('/badges', badgeController.buildRouter());
        app.use('/user-badges', userBadgeController.buildRouter());
        app.use('/workouts', workoutController.buildRouter());
        app.use('/challenge-participations', challengeParticipationController.buildRouter());
        app.use('/challenge-invitations', challengeInvitationController.buildRouter());
        app.use('/friendships', friendshipController.buildRouter());
        app.use('/leaderboards', leaderboardController.buildRouter());
        app.listen(process.env.PORT, () => console.log(`TSness API listening on port ${process.env.PORT}...`));
    });
}
function bootstrapAPI(userService, gymService, exerciseService, challengeService, badgeService, workoutService, friendshipService) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof process.env.TSNESS_ROOT_EMAIL === 'undefined') {
            throw new Error('TSNESS_ROOT_EMAIL is not defined');
        }
        if (typeof process.env.TSNESS_ROOT_PASSWORD === 'undefined') {
            throw new Error('TSNESS_ROOT_PASSWORD is not defined');
        }
        const rootUser = yield userService.findUser(process.env.TSNESS_ROOT_EMAIL);
        if (!rootUser) {
            console.log('Seeding database...');
            const superAdmin = yield userService.createUser({
                firstName: 'Super',
                lastName: 'Admin',
                password: process.env.TSNESS_ROOT_PASSWORD,
                email: process.env.TSNESS_ROOT_EMAIL,
                role: models_1.UserRole.SUPER_ADMIN,
                isActive: true,
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
                        profileVisibility: models_1.ProfileVisibility.PUBLIC,
                        workoutVisibility: models_1.WorkoutVisibility.FRIENDS_ONLY,
                        friendsListVisibility: models_1.FriendsListVisibility.FRIENDS_ONLY
                    },
                    units: {
                        weight: models_1.WeightUnit.KG,
                        distance: models_1.DistanceUnit.KM,
                        temperature: models_1.TemperatureUnit.CELSIUS
                    }
                }
            });
            const gymOwner1 = yield userService.createUser({
                firstName: 'Jean',
                lastName: 'Martin',
                email: 'jean.martin@fitnesscenter.fr',
                password: 'gymowner123',
                role: models_1.UserRole.GYM_OWNER,
                isActive: true,
                height: 180,
                weight: 75,
                fitnessLevel: models_1.FitnessLevel.ADVANCED,
                totalScore: 250,
                preferences: {
                    notifications: {
                        challengeInvites: true,
                        friendRequests: true,
                        achievements: true,
                        workoutReminders: true,
                        challengeUpdates: true
                    },
                    privacy: {
                        profileVisibility: models_1.ProfileVisibility.PUBLIC,
                        workoutVisibility: models_1.WorkoutVisibility.PUBLIC,
                        friendsListVisibility: models_1.FriendsListVisibility.FRIENDS_ONLY
                    },
                    units: {
                        weight: models_1.WeightUnit.KG,
                        distance: models_1.DistanceUnit.KM,
                        temperature: models_1.TemperatureUnit.CELSIUS
                    }
                }
            });
            const gymOwner2 = yield userService.createUser({
                firstName: 'Sophie',
                lastName: 'Dubois',
                email: 'sophie.dubois@powergym.fr',
                password: 'gymowner456',
                role: models_1.UserRole.GYM_OWNER,
                isActive: true,
                height: 165,
                weight: 58,
                fitnessLevel: models_1.FitnessLevel.EXPERT,
                totalScore: 420,
                preferences: {
                    notifications: {
                        challengeInvites: true,
                        friendRequests: true,
                        achievements: true,
                        workoutReminders: true,
                        challengeUpdates: true
                    },
                    privacy: {
                        profileVisibility: models_1.ProfileVisibility.PUBLIC,
                        workoutVisibility: models_1.WorkoutVisibility.PUBLIC,
                        friendsListVisibility: models_1.FriendsListVisibility.PUBLIC
                    },
                    units: {
                        weight: models_1.WeightUnit.KG,
                        distance: models_1.DistanceUnit.KM,
                        temperature: models_1.TemperatureUnit.CELSIUS
                    }
                }
            });
            const users = [];
            const userDatas = [
                { firstName: 'Pierre', lastName: 'Durand', email: 'pierre.durand@email.fr', fitnessLevel: models_1.FitnessLevel.BEGINNER, height: 175, weight: 80 },
                { firstName: 'Marie', lastName: 'Leroy', email: 'marie.leroy@email.fr', fitnessLevel: models_1.FitnessLevel.INTERMEDIATE, height: 160, weight: 55 },
                { firstName: 'Thomas', lastName: 'Moreau', email: 'thomas.moreau@email.fr', fitnessLevel: models_1.FitnessLevel.ADVANCED, height: 185, weight: 85 },
                { firstName: 'Julie', lastName: 'Simon', email: 'julie.simon@email.fr', fitnessLevel: models_1.FitnessLevel.INTERMEDIATE, height: 168, weight: 62 },
                { firstName: 'Antoine', lastName: 'Laurent', email: 'antoine.laurent@email.fr', fitnessLevel: models_1.FitnessLevel.BEGINNER, height: 170, weight: 70 },
                { firstName: 'Camille', lastName: 'Bernard', email: 'camille.bernard@email.fr', fitnessLevel: models_1.FitnessLevel.ADVANCED, height: 172, weight: 65 }
            ];
            for (const userData of userDatas) {
                const user = yield userService.createUser(Object.assign(Object.assign({}, userData), { password: 'user123', role: models_1.UserRole.USER, isActive: true, goals: ['Perdre du poids', 'Gagner en force'], totalScore: Math.floor(Math.random() * 200), preferences: {
                        notifications: {
                            challengeInvites: true,
                            friendRequests: true,
                            achievements: true,
                            workoutReminders: true,
                            challengeUpdates: true
                        },
                        privacy: {
                            profileVisibility: models_1.ProfileVisibility.PUBLIC,
                            workoutVisibility: models_1.WorkoutVisibility.FRIENDS_ONLY,
                            friendsListVisibility: models_1.FriendsListVisibility.FRIENDS_ONLY
                        },
                        units: {
                            weight: models_1.WeightUnit.KG,
                            distance: models_1.DistanceUnit.KM,
                            temperature: models_1.TemperatureUnit.CELSIUS
                        }
                    } }));
                users.push(user);
            }
            const gym1 = yield gymService.createGym({
                name: 'FitnessCenter Paris',
                address: {
                    streetNumber: '15',
                    street: 'Rue de la République',
                    city: 'Paris',
                    zipCode: '75001',
                    country: 'France'
                },
                phone: '01.42.35.67.89',
                description: 'Salle de sport moderne avec équipements de pointe',
                equipment: ['Haltères', 'Machines de musculation', 'Tapis de course', 'Vélos elliptiques'],
                activities: ['Musculation', 'Cardio', 'Cours collectifs'],
                capacity: 150,
                owner: gymOwner1._id,
                status: models_1.GymStatus.APPROVED,
                images: ['https://example.com/gym1.jpg']
            });
            const gym2 = yield gymService.createGym({
                name: 'PowerGym Lyon',
                address: {
                    streetNumber: '42',
                    street: 'Avenue Jean Jaurès',
                    city: 'Lyon',
                    zipCode: '69007',
                    country: 'France'
                },
                phone: '04.78.92.15.34',
                description: 'Salle dédiée à la musculation et au powerlifting',
                equipment: ['Barres olympiques', 'Racks à squat', 'Bancs de musculation', 'Kettlebells'],
                activities: ['Powerlifting', 'Musculation', 'Crossfit'],
                capacity: 80,
                owner: gymOwner2._id,
                status: models_1.GymStatus.APPROVED,
                images: ['https://example.com/gym2.jpg']
            });
            const exercises = [];
            const exerciseData = [
                {
                    name: 'Pompes',
                    description: 'Exercice de base pour le haut du corps',
                    targetedMuscles: ['Pectoraux', 'Triceps', 'Épaules'],
                    difficulty: models_1.ExerciseDifficulty.BEGINNER,
                    equipment: [],
                    instructions: ['Placez-vous en position de planche', 'Descendez en fléchissant les bras', 'Remontez en poussant']
                },
                {
                    name: 'Squats',
                    description: 'Exercice fondamental pour les jambes',
                    targetedMuscles: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
                    difficulty: models_1.ExerciseDifficulty.BEGINNER,
                    equipment: [],
                    instructions: ['Pieds écartés largeur d\'épaules', 'Descendez comme pour s\'asseoir', 'Remontez en poussant sur les talons']
                },
                {
                    name: 'Développé couché',
                    description: 'Exercice roi pour les pectoraux',
                    targetedMuscles: ['Pectoraux', 'Triceps', 'Épaules antérieures'],
                    difficulty: models_1.ExerciseDifficulty.INTERMEDIATE,
                    equipment: ['Barre', 'Banc'],
                    instructions: ['Allongez-vous sur le banc', 'Saisissez la barre', 'Descendez sur la poitrine', 'Poussez vers le haut']
                },
                {
                    name: 'Deadlift',
                    description: 'Soulevé de terre complet',
                    targetedMuscles: ['Dorsaux', 'Fessiers', 'Ischio-jambiers', 'Trapèzes'],
                    difficulty: models_1.ExerciseDifficulty.ADVANCED,
                    equipment: ['Barre', 'Disques'],
                    instructions: ['Placez-vous face à la barre', 'Fléchissez hanches et genoux', 'Soulevez en gardant le dos droit']
                },
                {
                    name: 'Tractions',
                    description: 'Exercice au poids du corps pour le dos',
                    targetedMuscles: ['Dorsaux', 'Biceps', 'Rhomboïdes'],
                    difficulty: models_1.ExerciseDifficulty.INTERMEDIATE,
                    equipment: ['Barre de traction'],
                    instructions: ['Suspendez-vous à la barre', 'Tirez jusqu\'à passer le menton', 'Redescendez contrôlé']
                },
                {
                    name: 'Burpees',
                    description: 'Exercice cardio complet',
                    targetedMuscles: ['Corps entier'],
                    difficulty: models_1.ExerciseDifficulty.ADVANCED,
                    equipment: [],
                    instructions: ['Position debout', 'Squat et planche', 'Pompe', 'Saut avec bras levés']
                }
            ];
            for (const exerciseInfo of exerciseData) {
                const exercise = yield exerciseService.createExercise(exerciseInfo);
                exercises.push(exercise);
            }
            const badges = [];
            const badgeData = [
                {
                    name: 'Premier Pas',
                    description: 'Complétez votre premier défi',
                    rarity: models_1.BadgeRarity.COMMON,
                    rules: [{
                            type: models_1.BadgeRuleType.CHALLENGES_COMPLETED,
                            value: 1,
                            operator: models_1.BadgeOperator.GREATER_THAN_OR_EQUAL,
                            field: 'challengesCompleted'
                        }],
                    isActive: true
                },
                {
                    name: 'Marathonien',
                    description: 'Brûlez 1000 calories',
                    rarity: models_1.BadgeRarity.RARE,
                    rules: [{
                            type: models_1.BadgeRuleType.CALORIES_BURNED,
                            value: 1000,
                            operator: models_1.BadgeOperator.GREATER_THAN_OR_EQUAL,
                            field: 'caloriesBurned'
                        }],
                    isActive: true
                },
                {
                    name: 'Assidu',
                    description: 'Soyez actif 7 jours',
                    rarity: models_1.BadgeRarity.EPIC,
                    rules: [{
                            type: models_1.BadgeRuleType.DAYS_ACTIVE,
                            value: 7,
                            operator: models_1.BadgeOperator.GREATER_THAN_OR_EQUAL,
                            field: 'daysActive'
                        }],
                    isActive: true
                },
                {
                    name: 'Légende',
                    description: 'Complétez 10 défis',
                    rarity: models_1.BadgeRarity.LEGENDARY,
                    rules: [{
                            type: models_1.BadgeRuleType.CHALLENGES_COMPLETED,
                            value: 10,
                            operator: models_1.BadgeOperator.GREATER_THAN_OR_EQUAL,
                            field: 'challengesCompleted'
                        }],
                    isActive: true
                }
            ];
            for (const badgeInfo of badgeData) {
                const badge = yield badgeService.createBadge(badgeInfo);
                badges.push(badge);
            }
            const challenges = [];
            const challengeData = [
                {
                    title: '30 Jours de Pompes',
                    description: 'Défi progressif sur 30 jours pour maîtriser les pompes',
                    exercises: [{ exercise: exercises[0]._id, sets: 3, reps: 15 }],
                    duration: 30,
                    difficulty: models_1.ChallengeDifficulty.EASY,
                    objectives: ['Améliorer la force du haut du corps', 'Progresser graduellement'],
                    rules: ['Faire les pompes tous les jours', 'Respecter la forme'],
                    startDate: new Date('2025-01-01'),
                    endDate: new Date('2025-01-31'),
                    maxParticipants: 100,
                    rewards: [{ type: models_1.RewardType.POINTS, value: 100, description: '100 points bonus' }],
                    creator: superAdmin._id,
                    gym: gym1._id,
                    isActive: true,
                    category: models_1.ChallengeCategory.STRENGTH
                },
                {
                    title: 'Cardio Intensif',
                    description: 'Programme cardio pour brûler un maximum de calories',
                    exercises: [{ exercise: exercises[5]._id, sets: 4, reps: 10 }],
                    duration: 14,
                    difficulty: models_1.ChallengeDifficulty.HARD,
                    objectives: ['Améliorer l\'endurance cardiovasculaire', 'Brûler des calories'],
                    rules: ['Séances de 30 minutes minimum', 'Pas plus de 2 jours de repos'],
                    startDate: new Date('2025-01-15'),
                    endDate: new Date('2025-01-29'),
                    maxParticipants: 50,
                    rewards: [{ type: models_1.RewardType.BADGE, value: 1, description: 'Badge spécial cardio' }],
                    creator: gymOwner1._id,
                    gym: gym1._id,
                    isActive: true,
                    category: models_1.ChallengeCategory.CARDIO
                },
                {
                    title: 'Force Pure',
                    description: 'Développez votre force avec les exercices de base',
                    exercises: [
                        { exercise: exercises[2]._id, sets: 5, reps: 8 },
                        { exercise: exercises[3]._id, sets: 5, reps: 5 }
                    ],
                    duration: 21,
                    difficulty: models_1.ChallengeDifficulty.EXTREME,
                    objectives: ['Augmenter la force maximale', 'Maîtriser les mouvements composés'],
                    rules: ['Progression hebdomadaire obligatoire', 'Échauffement complet requis'],
                    startDate: new Date('2025-02-01'),
                    endDate: new Date('2025-02-21'),
                    maxParticipants: 25,
                    rewards: [
                        { type: models_1.RewardType.POINTS, value: 300, description: '300 points de force' },
                        { type: models_1.RewardType.FREE_SESSION, value: 1, description: 'Séance coaching gratuite' }
                    ],
                    creator: gymOwner2._id,
                    gym: gym2._id,
                    isActive: true,
                    category: models_1.ChallengeCategory.STRENGTH
                }
            ];
            for (const challengeInfo of challengeData) {
                const challenge = yield challengeService.createChallenge(challengeInfo);
                challenges.push(challenge);
            }
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const numWorkouts = Math.floor(Math.random() * 5) + 1;
                for (let j = 0; j < numWorkouts; j++) {
                    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
                    const sessionDate = new Date();
                    sessionDate.setDate(sessionDate.getDate() - Math.floor(Math.random() * 30));
                    yield workoutService.createWorkoutSession({
                        user: user._id,
                        gym: Math.random() > 0.5 ? gym1._id : gym2._id,
                        exercises: [{
                                exercise: randomExercise._id,
                                sets: [
                                    { reps: 10, weight: 20, restTime: 60 },
                                    { reps: 8, weight: 25, restTime: 60 },
                                    { reps: 6, weight: 30, restTime: 90 }
                                ],
                                notes: 'Bonne séance'
                            }],
                        duration: Math.floor(Math.random() * 60) + 30,
                        caloriesBurned: Math.floor(Math.random() * 400) + 200,
                        sessionDate,
                        notes: 'Séance productive'
                    });
                }
            }
            for (let i = 0; i < users.length - 1; i++) {
                if (Math.random() > 0.6) {
                    yield friendshipService.sendFriendRequest(users[i]._id, users[i + 1]._id);
                    if (Math.random() > 0.3) {
                        const friendship = yield friendshipService.friendshipModel.findOne({
                            requester: users[i]._id,
                            receiver: users[i + 1]._id
                        });
                        if (friendship) {
                            yield friendshipService.acceptFriendRequest(friendship._id);
                        }
                    }
                }
            }
            console.log('Database seeded successfully!');
            console.log(`Created ${users.length + 3} users (including admin and gym owners)`);
            console.log(`Created ${exercises.length} exercises`);
            console.log(`Created ${badges.length} badges`);
            console.log(`Created ${challenges.length} challenges`);
            console.log(`Created 2 gyms`);
            console.log('Seeding completed!');
        }
        else {
            console.log('Root user already exists, skipping seeding.');
        }
    });
}
startAPI().catch(console.error);
