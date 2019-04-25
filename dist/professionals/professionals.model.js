"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: false
    }
});
const proSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    skills: {
        type: [skillSchema],
        required: false,
        select: false,
        default: []
    }
});
exports.Professional = mongoose.model('Professional', proSchema);
