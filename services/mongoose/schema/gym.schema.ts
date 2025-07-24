import {Schema} from "mongoose";
import {Gym, GymStatus} from "../../../models";
import {addressSchema} from "./address.schema";

export function gymSchema(): Schema<Gym> {
    return new Schema<Gym>({
        name: {
            type: String,
            required: true
        },
        address: {
            type: addressSchema(),
            required: true
        },
        phone: {
            type: String
        },
        description: {
            type: String
        },
        equipment: [{
            type: String
        }],
        activities: [{
            type: String
        }],
        capacity: {
            type: Number,
            required: true,
            min: 1
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: Object.values(GymStatus),
            default: GymStatus.PENDING
        },
        images: [{
            type: String
        }]
    }, {
        timestamps: true,
        collection: "gyms",
        versionKey: false,
    });
}