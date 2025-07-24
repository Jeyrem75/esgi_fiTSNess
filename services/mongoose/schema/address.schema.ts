import {Schema} from "mongoose";
import {Address} from "../../../models";

export function addressSchema(): Schema<Address> {
    return new Schema<Address>({
        streetNumber: {
            type: String,
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: 'France'
        }
    }, {
        _id: false,
    });
}