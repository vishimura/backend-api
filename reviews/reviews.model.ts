import * as mongoose from 'mongoose'
import { Professional } from '../professionals/professionals.model';
import { User } from '../users/users.model';

export interface Review extends mongoose.Document {
    date: Date,
    rating: number,
    comments: string,
    professional: mongoose.Types.ObjectId | Professional,
    user: mongoose.Types.ObjectId | User
}

const reviewSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comments: {
        type: String,
        required: true,
        maxlength: 500
    },
    professional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professional',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}) 

export const Review = mongoose.model<Review>('Review', reviewSchema)