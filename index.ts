import { config } from "dotenv";
import express from "express";
import {
    openConnection,
    SessionService,
    UserService,
    GymService,
    ExerciseService,
    ChallengeService,
    BadgeService,
    UserBadgeService,
    WorkoutService,
    ChallengeParticipationService,
    ChallengeInvitationService,
    FriendshipService,
    LeaderboardService
} from "./services/mongoose";
import { 
    UserRole, 
    FitnessLevel, 
    GymStatus, 
    ExerciseDifficulty, 
    ChallengeDifficulty, 
    ChallengeCategory,
    BadgeRarity,
    BadgeRuleType,
    BadgeOperator,
    RewardType,
    ProfileVisibility,
    WorkoutVisibility,
    FriendsListVisibility,
    WeightUnit,
    DistanceUnit,
    TemperatureUnit
} from "./models";
import {
    AuthController,
    UserController,
    GymController,
    ExerciseController,
    ChallengeController,
    BadgeController,
    UserBadgeController,
    WorkoutController,
    ChallengeParticipationController,
    ChallengeInvitationController,
    FriendshipController,
    LeaderboardController
} from "./controllers";

config();

async function startAPI() {
    const connection = await openConnection();
    
    const userService = new UserService(connection);
    const sessionService = new SessionService(connection);
    const gymService = new GymService(connection);
    const exerciseService = new ExerciseService(connection);
    const challengeService = new ChallengeService(connection);
    const badgeService = new BadgeService(connection);
    const userBadgeService = new UserBadgeService(connection);
    const workoutService = new WorkoutService(connection);
    const challengeParticipationService = new ChallengeParticipationService(connection);
    const challengeInvitationService = new ChallengeInvitationService(connection);
    const friendshipService = new FriendshipService(connection);
    const leaderboardService = new LeaderboardService(connection);

    await bootstrapAPI(userService, gymService, exerciseService, challengeService, badgeService, workoutService, friendshipService);

    const app = express();
    
    const authController = new AuthController(userService, sessionService);
    const userController = new UserController(userService, sessionService);
    const gymController = new GymController(gymService, sessionService);
    const exerciseController = new ExerciseController(exerciseService, sessionService);
    const challengeController = new ChallengeController(challengeService, sessionService);
    const badgeController = new BadgeController(badgeService, sessionService);
    const userBadgeController = new UserBadgeController(
        userBadgeService, 
        badgeService, 
        workoutService, 
        challengeParticipationService, 
        sessionService
    );
    const workoutController = new WorkoutController(workoutService, sessionService);
    const challengeParticipationController = new ChallengeParticipationController(
        challengeParticipationService,
        challengeService,
        userBadgeService,
        badgeService,
        workoutService,
        sessionService
    );
    const challengeInvitationController = new ChallengeInvitationController(
        challengeInvitationService,
        challengeService,
        friendshipService,
        challengeParticipationService,
        sessionService
    );
    const friendshipController = new FriendshipController(friendshipService, sessionService);
    const leaderboardController = new LeaderboardController(
        leaderboardService,
        challengeParticipationService,
        sessionService
    );

    app.use('/auth', authController.buildRouter());
    app.use('/users', userController.buildRouter());
    app.use('/gyms', gymController.buildRouter());
    app.use('/exercises', exerciseController.buildRouter());
    app.use('/challenges', challengeController.buildRouter());
    app.use('/badges', badgeController.buildRouter());
    app.use('/user-badges', userBadgeController.buildRouter());
    app.use('/workouts', workoutController.buildRouter());
    app.use('/participations', challengeParticipationController.buildRouter());
    app.use('/invitations', challengeInvitationController.buildRouter());
    app.use('/friendships', friendshipController.buildRouter());
    app.use('/leaderboards', leaderboardController.buildRouter());

    app.listen(process.env.PORT, () => console.log(`TSness API listening on port ${process.env.PORT}...`));
}

async function bootstrapAPI(
    userService: UserService,
    gymService: GymService,
    exerciseService: ExerciseService,
    challengeService: ChallengeService,
    badgeService: BadgeService,
    workoutService: WorkoutService,
    friendshipService: FriendshipService
) {
    if (typeof process.env.TSNESS_ROOT_EMAIL === 'undefined') {
        throw new Error('TSNESS_ROOT_EMAIL is not defined');
    }
    if (typeof process.env.TSNESS_ROOT_PASSWORD === 'undefined') {
        throw new Error('TSNESS_ROOT_PASSWORD is not defined');
    }

    const rootUser = await userService.findUser(process.env.TSNESS_ROOT_EMAIL);
    if (!rootUser) {
        console.log('Seeding database...');

        const superAdmin = await userService.createUser({
            firstName: 'Super',
            lastName: 'Admin',
            password: process.env.TSNESS_ROOT_PASSWORD,
            email: process.env.TSNESS_ROOT_EMAIL,
            role: UserRole.SUPER_ADMIN,
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

        const gymOwner1 = await userService.createUser({
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'jean.martin@fitnesscenter.fr',
            password: 'gymowner123',
            role: UserRole.GYM_OWNER,
            isActive: true,
            height: 180,
            weight: 75,
            fitnessLevel: FitnessLevel.ADVANCED,
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
                    profileVisibility: ProfileVisibility.PUBLIC,
                    workoutVisibility: WorkoutVisibility.PUBLIC,
                    friendsListVisibility: FriendsListVisibility.FRIENDS_ONLY
                },
                units: {
                    weight: WeightUnit.KG,
                    distance: DistanceUnit.KM,
                    temperature: TemperatureUnit.CELSIUS
                }
            }
        });

        const gymOwner2 = await userService.createUser({
            firstName: 'Sophie',
            lastName: 'Dubois',
            email: 'sophie.dubois@powergym.fr',
            password: 'gymowner456',
            role: UserRole.GYM_OWNER,
            isActive: true,
            height: 165,
            weight: 58,
            fitnessLevel: FitnessLevel.EXPERT,
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
                    profileVisibility: ProfileVisibility.PUBLIC,
                    workoutVisibility: WorkoutVisibility.PUBLIC,
                    friendsListVisibility: FriendsListVisibility.PUBLIC
                },
                units: {
                    weight: WeightUnit.KG,
                    distance: DistanceUnit.KM,
                    temperature: TemperatureUnit.CELSIUS
                }
            }
        });

        const users = [];
        const userDatas = [
            { firstName: 'Pierre', lastName: 'Durand', email: 'pierre.durand@email.fr', fitnessLevel: FitnessLevel.BEGINNER, height: 175, weight: 80 },
            { firstName: 'Marie', lastName: 'Leroy', email: 'marie.leroy@email.fr', fitnessLevel: FitnessLevel.INTERMEDIATE, height: 160, weight: 55 },
            { firstName: 'Thomas', lastName: 'Moreau', email: 'thomas.moreau@email.fr', fitnessLevel: FitnessLevel.ADVANCED, height: 185, weight: 85 },
            { firstName: 'Julie', lastName: 'Simon', email: 'julie.simon@email.fr', fitnessLevel: FitnessLevel.INTERMEDIATE, height: 168, weight: 62 },
            { firstName: 'Antoine', lastName: 'Laurent', email: 'antoine.laurent@email.fr', fitnessLevel: FitnessLevel.BEGINNER, height: 170, weight: 70 },
            { firstName: 'Camille', lastName: 'Bernard', email: 'camille.bernard@email.fr', fitnessLevel: FitnessLevel.ADVANCED, height: 172, weight: 65 }
        ];

        for (const userData of userDatas) {
            const user = await userService.createUser({
                ...userData,
                password: 'user123',
                role: UserRole.USER,
                isActive: true,
                goals: ['Perdre du poids', 'Gagner en force'],
                totalScore: Math.floor(Math.random() * 200),
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
            users.push(user);
        }

        const gym1 = await gymService.createGym({
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
            status: GymStatus.APPROVED,
            images: ['https://example.com/gym1.jpg']
        });

        const gym2 = await gymService.createGym({
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
            status: GymStatus.APPROVED,
            images: ['https://example.com/gym2.jpg']
        });

        const exercises = [];
        const exerciseData = [
            {
                name: 'Pompes',
                description: 'Exercice de base pour le haut du corps',
                targetedMuscles: ['Pectoraux', 'Triceps', 'Épaules'],
                difficulty: ExerciseDifficulty.BEGINNER,
                equipment: [],
                instructions: ['Placez-vous en position de planche', 'Descendez en fléchissant les bras', 'Remontez en poussant']
            },
            {
                name: 'Squats',
                description: 'Exercice fondamental pour les jambes',
                targetedMuscles: ['Quadriceps', 'Fessiers', 'Ischio-jambiers'],
                difficulty: ExerciseDifficulty.BEGINNER,
                equipment: [],
                instructions: ['Pieds écartés largeur d\'épaules', 'Descendez comme pour s\'asseoir', 'Remontez en poussant sur les talons']
            },
            {
                name: 'Développé couché',
                description: 'Exercice roi pour les pectoraux',
                targetedMuscles: ['Pectoraux', 'Triceps', 'Épaules antérieures'],
                difficulty: ExerciseDifficulty.INTERMEDIATE,
                equipment: ['Barre', 'Banc'],
                instructions: ['Allongez-vous sur le banc', 'Saisissez la barre', 'Descendez sur la poitrine', 'Poussez vers le haut']
            },
            {
                name: 'Deadlift',
                description: 'Soulevé de terre complet',
                targetedMuscles: ['Dorsaux', 'Fessiers', 'Ischio-jambiers', 'Trapèzes'],
                difficulty: ExerciseDifficulty.ADVANCED,
                equipment: ['Barre', 'Disques'],
                instructions: ['Placez-vous face à la barre', 'Fléchissez hanches et genoux', 'Soulevez en gardant le dos droit']
            },
            {
                name: 'Tractions',
                description: 'Exercice au poids du corps pour le dos',
                targetedMuscles: ['Dorsaux', 'Biceps', 'Rhomboïdes'],
                difficulty: ExerciseDifficulty.INTERMEDIATE,
                equipment: ['Barre de traction'],
                instructions: ['Suspendez-vous à la barre', 'Tirez jusqu\'à passer le menton', 'Redescendez contrôlé']
            },
            {
                name: 'Burpees',
                description: 'Exercice cardio complet',
                targetedMuscles: ['Corps entier'],
                difficulty: ExerciseDifficulty.ADVANCED,
                equipment: [],
                instructions: ['Position debout', 'Squat et planche', 'Pompe', 'Saut avec bras levés']
            }
        ];

        for (const exerciseInfo of exerciseData) {
            const exercise = await exerciseService.createExercise(exerciseInfo);
            exercises.push(exercise);
        }

        const badges = [];
        const badgeData = [
            {
                name: 'Premier Pas',
                description: 'Complétez votre premier défi',
                rarity: BadgeRarity.COMMON,
                rules: [{
                    type: BadgeRuleType.CHALLENGES_COMPLETED,
                    value: 1,
                    operator: BadgeOperator.GREATER_THAN_OR_EQUAL,
                    field: 'challengesCompleted'
                }],
                isActive: true
            },
            {
                name: 'Marathonien',
                description: 'Brûlez 1000 calories',
                rarity: BadgeRarity.RARE,
                rules: [{
                    type: BadgeRuleType.CALORIES_BURNED,
                    value: 1000,
                    operator: BadgeOperator.GREATER_THAN_OR_EQUAL,
                    field: 'caloriesBurned'
                }],
                isActive: true
            },
            {
                name: 'Assidu',
                description: 'Soyez actif 7 jours',
                rarity: BadgeRarity.EPIC,
                rules: [{
                    type: BadgeRuleType.DAYS_ACTIVE,
                    value: 7,
                    operator: BadgeOperator.GREATER_THAN_OR_EQUAL,
                    field: 'daysActive'
                }],
                isActive: true
            },
            {
                name: 'Légende',
                description: 'Complétez 10 défis',
                rarity: BadgeRarity.LEGENDARY,
                rules: [{
                    type: BadgeRuleType.CHALLENGES_COMPLETED,
                    value: 10,
                    operator: BadgeOperator.GREATER_THAN_OR_EQUAL,
                    field: 'challengesCompleted'
                }],
                isActive: true
            }
        ];

        for (const badgeInfo of badgeData) {
            const badge = await badgeService.createBadge(badgeInfo);
            badges.push(badge);
        }

        const challenges = [];
        const challengeData = [
            {
                title: '30 Jours de Pompes',
                description: 'Défi progressif sur 30 jours pour maîtriser les pompes',
                exercises: [{ exercise: exercises[0]._id, sets: 3, reps: 15 }],
                duration: 30,
                difficulty: ChallengeDifficulty.EASY,
                objectives: ['Améliorer la force du haut du corps', 'Progresser graduellement'],
                rules: ['Faire les pompes tous les jours', 'Respecter la forme'],
                startDate: new Date('2025-01-01'),
                endDate: new Date('2025-01-31'),
                maxParticipants: 100,
                rewards: [{ type: RewardType.POINTS, value: 100, description: '100 points bonus' }],
                creator: superAdmin._id,
                gym: gym1._id,
                isActive: true,
                category: ChallengeCategory.STRENGTH
            },
            {
                title: 'Cardio Intensif',
                description: 'Programme cardio pour brûler un maximum de calories',
                exercises: [{ exercise: exercises[5]._id, sets: 4, reps: 10 }],
                duration: 14,
                difficulty: ChallengeDifficulty.HARD,
                objectives: ['Améliorer l\'endurance cardiovasculaire', 'Brûler des calories'],
                rules: ['Séances de 30 minutes minimum', 'Pas plus de 2 jours de repos'],
                startDate: new Date('2025-01-15'),
                endDate: new Date('2025-01-29'),
                maxParticipants: 50,
                rewards: [{ type: RewardType.BADGE, value: 1, description: 'Badge spécial cardio' }],
                creator: gymOwner1._id,
                gym: gym1._id,
                isActive: true,
                category: ChallengeCategory.CARDIO
            },
            {
                title: 'Force Pure',
                description: 'Développez votre force avec les exercices de base',
                exercises: [
                    { exercise: exercises[2]._id, sets: 5, reps: 8 },
                    { exercise: exercises[3]._id, sets: 5, reps: 5 }
                ],
                duration: 21,
                difficulty: ChallengeDifficulty.EXTREME,
                objectives: ['Augmenter la force maximale', 'Maîtriser les mouvements composés'],
                rules: ['Progression hebdomadaire obligatoire', 'Échauffement complet requis'],
                startDate: new Date('2025-02-01'),
                endDate: new Date('2025-02-21'),
                maxParticipants: 25,
                rewards: [
                    { type: RewardType.POINTS, value: 300, description: '300 points de force' },
                    { type: RewardType.FREE_SESSION, value: 1, description: 'Séance coaching gratuite' }
                ],
                creator: gymOwner2._id,
                gym: gym2._id,
                isActive: true,
                category: ChallengeCategory.STRENGTH
            }
        ];

        for (const challengeInfo of challengeData) {
            const challenge = await challengeService.createChallenge(challengeInfo);
            challenges.push(challenge);
        }

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const numWorkouts = Math.floor(Math.random() * 5) + 1;
            
            for (let j = 0; j < numWorkouts; j++) {
                const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
                const sessionDate = new Date();
                sessionDate.setDate(sessionDate.getDate() - Math.floor(Math.random() * 30));
                
                await workoutService.createWorkoutSession({
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
                await friendshipService.sendFriendRequest(users[i]._id, users[i + 1]._id);
                if (Math.random() > 0.3) {
                    const friendship = await friendshipService.friendshipModel.findOne({
                        requester: users[i]._id,
                        receiver: users[i + 1]._id
                    });
                    if (friendship) {
                        await friendshipService.acceptFriendRequest(friendship._id);
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
    } else {
        console.log('Root user already exists, skipping seeding.');
    }
}

startAPI().catch(console.error);