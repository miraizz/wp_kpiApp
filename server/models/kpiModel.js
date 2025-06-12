const mongoose = require('mongoose');

const assignedToSchema = new mongoose.Schema({
    name: String,
    staffId: String,
    department: String
}, { _id: false });

const assignedBySchema = new mongoose.Schema({
    name: String,
    managerId: String
}, { _id: false });

const kpiSchema = new mongoose.Schema({
    id: { type: String, unique: true }, // KPI-2025-001
    title: String,
    description: String,
    category: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'] },
    progress: Number,
    status: { type: String, enum: ['On Track', 'Behind', 'At Risk', 'Completed'] },
    submitted: { type: Boolean, default: false },
    verifyStatus: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
    startDate: Date,
    dueDate: Date,
    assignedTo: assignedToSchema,
    assignedBy: assignedBySchema,
    evidence: String // could be a file path or URL
}, { timestamps: true });

module.exports = mongoose.model('KPI', kpiSchema);
