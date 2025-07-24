import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import {WorkoutSession, ChallengeParticipation} from "../../../models";
import {workoutSessionSchema, challengeParticipationSchema} from "../schema";

export type CreateWorkoutSession = Omit<WorkoutSession, '_id' | 'createdAt' | 'updatedAt'>;

export class WorkoutService {
    readonly workoutSessionModel: Model<WorkoutSession>;
    readonly challengeParticipationModel: Model<ChallengeParticipation>;

    constructor(public readonly connection: Mongoose) {
        this.workoutSessionModel = connection.model('WorkoutSession', workoutSessionSchema());
        this.challengeParticipationModel = connection.model('ChallengeParticipation', challengeParticipationSchema());
    }

    async createWorkoutSession(session: CreateWorkoutSession): Promise<WorkoutSession> {
        return this.workoutSessionModel.create(session);
    }

    async findWorkoutSessions(filter: FilterQuery<WorkoutSession> = {}): Promise<WorkoutSession[]> {
        return this.workoutSessionModel.find(filter)
            .populate('user')
            .populate('challenge')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findWorkoutSessionById(sessionId: string): Promise<WorkoutSession | null> {
        if(!isValidObjectId(sessionId)) {
            return null;
        }
        return this.workoutSessionModel.findById(sessionId)
            .populate('user')
            .populate('challenge')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async findUserWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
        if(!isValidObjectId(userId)) {
            return [];
        }
        return this.workoutSessionModel.find({ user: userId })
            .populate('user')
            .populate('challenge')
            .populate('gym')
            .populate('exercises.exercise')
            .sort({ sessionDate: -1 });
    }

    async findChallengeWorkoutSessions(challengeId: string): Promise<WorkoutSession[]> {
        if(!isValidObjectId(challengeId)) {
            return [];
        }
        return this.workoutSessionModel.find({ challenge: challengeId })
            .populate('user')
            .populate('challenge')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async updateWorkoutSession(sessionId: string, update: Partial<CreateWorkoutSession>): Promise<WorkoutSession | null> {
        if(!isValidObjectId(sessionId)) {
            return null;
        }
        return this.workoutSessionModel.findByIdAndUpdate(sessionId, update, { new: true })
            .populate('user')
            .populate('challenge')
            .populate('gym')
            .populate('exercises.exercise');
    }

    async deleteWorkoutSession(sessionId: string): Promise<void> {
        if(!isValidObjectId(sessionId)) {
            return;
        }
        await this.workoutSessionModel.deleteOne({ _id: sessionId });
    }

    async getUserStats(userId: string): Promise<any> {
        if(!isValidObjectId(userId)) {
            return {};
        }

        const workoutSessions = await this.workoutSessionModel.find({ user: userId });
        
        const totalWorkouts = workoutSessions.length;
        const totalCaloriesBurned = workoutSessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0);
        
        const uniqueDays = new Set(workoutSessions.map(session => 
            session.sessionDate.toISOString().split('T')[0]
        )).size;

        const uniqueGyms = new Set(workoutSessions
            .filter(session => session.gym)
            .map(session => session.gym?.toString())
        ).size;

        return {
            workoutsCompleted: totalWorkouts,
            caloriesBurned: totalCaloriesBurned,
            daysActive: uniqueDays,
            gymsVisited: uniqueGyms
        };
    }
}