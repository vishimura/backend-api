import * as mongoose from 'mongoose'

export interface Skill extends mongoose.Document {
    name: string,
    experience: number
}

export interface Professional extends mongoose.Document {
    name: string,
    skills: Skill[]
}

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: false
    }
})

const proSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    skills:{
        type: [skillSchema],
        required: false,
        select: false,
        default: []
    }
})

export const Professional = mongoose.model<Professional>('Professional', proSchema)