const KPI = require('../models/kpiModel');

// Get all KPIs
exports.getAllKPIs = async (req, res) => {
    try {
        const kpis = await KPI.find();
        res.json(kpis);
    } catch (err) {
        console.error('Error fetching KPIs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a single KPI by ID
exports.getKPIById = async (req, res) => {
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

// Create a new KPI
exports.createKPI = async (req, res) => {
    try {
        const count = await KPI.countDocuments();
        const newId = `KPI-2025-${String(count + 1).padStart(3, '0')}`;
        const kpi = await KPI.create({ ...req.body, id: newId });
        res.status(201).json(kpi);
    } catch (err) {
        console.error('Error creating KPI:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update KPI by ID
exports.updateKPI = async (req, res) => {
    try {
        const updated = await KPI.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: 'KPI not found' });
        }
        res.json(updated);
    } catch (err) {
        console.error('Error updating KPI:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete KPI by ID
exports.deleteKPI = async (req, res) => {
    try {
        const deleted = await KPI.findOneAndDelete({ id: req.params.id });
        if (!deleted) {
            return res.status(404).json({ error: 'KPI not found' });
        }
        res.json({ message: 'KPI deleted successfully' });
    } catch (err) {
        console.error('Error deleting KPI:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
