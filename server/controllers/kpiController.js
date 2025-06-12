const KPI = require('../models/kpiModel');

/**
 * GET /api/kpi
 * Retrieve all KPI records
 */
exports.getAllKPIs = async (req, res) => {
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

/**
 * POST /api/kpi
 * Create a new KPI entry with auto-generated ID
 */
exports.createKPI = async (req, res) => {
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
exports.updateKPI = async (req, res) => {
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
exports.deleteKPI = async (req, res) => {
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

exports.getPendingKPIs = async (req, res) => {
    try {
        const kpis = await KPI.find({
            status: 'Completed',
            progress: 100,
            submitted: true,
            verifyStatus: 'Pending'
        });
        res.status(200).json(kpis);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch pending KPIs' });
    }
};

exports.verifyKPI = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;

        const updated = await KPI.findOneAndUpdate(
            { id },
            {
                status,
                verifyStatus: status === 'Accepted' ? 'Accepted' : 'Rejected',
                comments: comment || '',
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ error: 'KPI not found' });

        res.json(updated);
    } catch (err) {
        console.error('Error verifying KPI:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getKPIsByStaffId = async (req, res) => {
    try {
        const staffId = req.params.staffId;
        const kpis = await KPI.find({ 'assignedTo.staffId': staffId });
        res.json(kpis);
    } catch (err) {
        console.error('Error fetching staff KPIs:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};