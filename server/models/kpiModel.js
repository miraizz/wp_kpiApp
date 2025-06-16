const mongoose = require('mongoose');

const assignedToSchema = new mongoose.Schema({
    name: { type: String, required: true },
    staffId: { type: String, required: true },
    department: { type: String, required: true }
}, { _id: false });

const assignedBySchema = new mongoose.Schema({
    name: { type: String, required: true },
    managerId: { type: String, required: true }
}, { _id: false });

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    date: { 
        type: Date, 
        default: Date.now,
        get: (date) => date ? date.toISOString() : null,
        set: (date) => date ? new Date(date) : new Date()
    },
    progress: { type: Number, default: 0 },
    isFinal: { type: Boolean, default: false },
    by: { type: String, enum: ['Staff', 'Manager'], default: 'Staff' }
}, { _id: false });

const evidenceFileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
    data: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                // Check if the string is a valid base64 string
                return /^[A-Za-z0-9+/=]+$/.test(v);
            },
            message: 'Invalid base64 data format'
        }
    }
}, { _id: false });

const kpiSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true }, // KPI-2025-001
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'General' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: {
        type: String,
        enum: ['On Track', 'Behind', 'At Risk', 'Completed'],
        default: 'Behind'
    },
    submitted: { type: Boolean, default: false },
    verifyStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },

    assignedTo: { type: assignedToSchema, required: true },
    assignedBy: { type: assignedBySchema, required: true },

    comments: { type: [commentSchema], default: [] },
    evidenceFiles: { type: [evidenceFileSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('KPI', kpiSchema, 'kpis');
