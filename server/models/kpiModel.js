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

const kpiSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true }, // KPI-2025-001
    title: { type: String, required: true },
    description: { type: String, default: '' }, // optional
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
    evidence: { type: String, default: '' } // optional
}, { timestamps: true });

module.exports = mongoose.model('KPI', kpiSchema, 'KPI');
