import {Mongoose, Model, FilterQuery, isValidObjectId} from "mongoose";
import {Exercise, ExerciseDifficulty} from "../../../models";
import {exerciseSchema} from "../schema";

export type CreateExercise = Omit<Exercise, '_id' | 'createdAt' | 'updatedAt'>;

export class ExerciseService {
    readonly exerciseModel: Model<Exercise>;

    constructor(public readonly connection: Mongoose) {
        this.exerciseModel = connection.model('Exercise', exerciseSchema());
    }

    async createExercise(exercise: CreateExercise): Promise<Exercise> {
        return this.exerciseModel.create(exercise);
    }

    async findExercises(filter: FilterQuery<Exercise> = {}): Promise<Exercise[]> {
        return this.exerciseModel.find(filter);
    }

    async findExerciseById(exerciseId: string): Promise<Exercise | null> {
        if(!isValidObjectId(exerciseId)) {
            return null;
        }
        return this.exerciseModel.findById(exerciseId);
    }

    async findExercisesByDifficulty(difficulty: ExerciseDifficulty): Promise<Exercise[]> {
        return this.exerciseModel.find({ difficulty });
    }

    async findExercisesByMuscle(muscle: string): Promise<Exercise[]> {
        return this.exerciseModel.find({ targetedMuscles: { $in: [muscle] } });
    }

    async findExercisesByEquipment(equipment: string): Promise<Exercise[]> {
        return this.exerciseModel.find({ equipment: { $in: [equipment] } });
    }

    async updateExercise(exerciseId: string, update: Partial<CreateExercise>): Promise<Exercise | null> {
        if(!isValidObjectId(exerciseId)) {
            return null;
        }
        return this.exerciseModel.findByIdAndUpdate(exerciseId, update, { new: true });
    }

    async deleteExercise(exerciseId: string): Promise<void> {
        if(!isValidObjectId(exerciseId)) {
            return;
        }
        await this.exerciseModel.deleteOne({ _id: exerciseId });
    }

    async searchExercises(query: string): Promise<Exercise[]> {
        return this.exerciseModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { targetedMuscles: { $in: [new RegExp(query, 'i')] } }
            ]
        });
    }
}