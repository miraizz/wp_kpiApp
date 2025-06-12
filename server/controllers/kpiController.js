const KPI = require('../models/kpiModel');

/**
 * GET /api/kpi
 * Retrieve all KPI records
 */
const getAllKPIs = async (req, res) => {
    try {
        const kpis = await KPI.find();
        res.json(kpis);
    } catch (err) {
        console.error('Error fetching KPIs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * GET /api/kpi/:id
 * Retrieve a single KPI by custom ID (e.g., KPI-2025-001)
 */
const getKPIById = async (req, res) => {
    try {
        const kpi = await KPI.findOne({ id: req.params.id });
        if (!kpi) {
            return res.status(404).json({ error: 'KPI not found' });
        }
        res.json(kpi);
    } catch (err) {
        console.error('Error fetching KPI:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * POST /api/kpi
 * Create a new KPI entry with auto-generated ID
 */
const createKPI = async (req, res) => {
    try {
        const count = await KPI.countDocuments();
        const newId = `KPI-2025-${String(count + 1).padStart(3, '0')}`;

        const kpi = new KPI({
            ...req.body,
            id: newId,
            submitted: false,
            verifyStatus: 'Pending'
        });

        await kpi.save();
        res.status(201).json(kpi);
    } catch (err) {
        console.error('Error creating KPI:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

/**
 * PUT /api/kpi/:id
 * Update an existing KPI by custom ID
 */
const updateKPI = async (req, res) => {
    try {
        const updated = await KPI.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'KPI not found' });
        }
        res.json(updated);
    } catch (err) {
        console.error('Error updating KPI:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

/**
 * DELETE /api/kpi/:id
 * Delete a KPI by custom ID
 */
const deleteKPI = async (req, res) => {
    try {
        const deleted = await KPI.findOneAndDelete({ id: req.params.id });
        if (!deleted) {
            return res.status(404).json({ error: 'KPI not found' });
        }
        res.json({ message: 'KPI deleted successfully' });
    } catch (err) {
        console.error('Error deleting KPI:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

// ✅ Exporting all controller functions
module.exports = {
    getAllKPIs,
    getKPIById,
    createKPI,
    updateKPI,
    deleteKPI
};
