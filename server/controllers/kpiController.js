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
        console.log('Update KPI request received:', {
            id: req.params.id,
            hasEvidenceFiles: Array.isArray(req.body.evidenceFiles),
            evidenceFilesCount: req.body.evidenceFiles?.length
        });

        const kpi = await KPI.findOne({ id: req.params.id });
        if (!kpi) {
            console.log('KPI not found:', req.params.id);
            return res.status(404).json({ error: 'KPI not found' });
        }

        const {
            progress,
            status,
            submitted,
            verifyStatus,
            comments,
            evidenceFiles,
            title,
            description,
            category,
            priority,
            startDate,
            dueDate,
            assignedTo,
            assignedBy
        } = req.body;

        // Validate progress if provided
        if (typeof progress !== 'undefined') {
            if (progress < 0 || progress > 100) {
                console.log('Invalid progress value:', progress);
                return res.status(400).json({ error: 'Progress must be between 0 and 100' });
            }
            kpi.progress = progress;
            console.log('Updated progress:', progress);
        }

        // Validate status if provided
        if (typeof status !== 'undefined') {
            const validStatuses = ['On Track', 'Behind', 'At Risk', 'Completed'];
            if (!validStatuses.includes(status)) {
                console.log('Invalid status value:', status);
                return res.status(400).json({ error: 'Invalid status value' });
            }
            kpi.status = status;
            console.log('Updated status:', status);
        }

        if (typeof submitted !== 'undefined') kpi.submitted = submitted;
        if (typeof verifyStatus !== 'undefined') kpi.verifyStatus = verifyStatus;
        
        // Update comments if provided
        if (Array.isArray(comments)) {
            kpi.comments = comments;
            console.log('Updated comments:', comments.length);
        }

        // Update evidence files if provided
        if (Array.isArray(evidenceFiles)) {
            console.log('Updating evidence files:', evidenceFiles.length);
            // Validate each evidence file
            const validFiles = evidenceFiles.every(file => {
                console.log('Validating file:', {
                    filename: file.filename,
                    mimetype: file.mimetype,
                    dataLength: file.data?.length,
                    dataStart: file.data?.substring(0, 20),
                    dataEnd: file.data?.substring(file.data.length - 20),
                    isValidBase64: /^[A-Za-z0-9+/=]+$/.test(file.data),
                    isValidLength: file.data?.length % 4 === 0
                });
                return file.filename && 
                       file.mimetype && 
                       file.data && 
                       file.uploadedAt &&
                       /^[A-Za-z0-9+/=]+$/.test(file.data) &&
                       file.data.length % 4 === 0;
            });

            if (!validFiles) {
                console.log('Invalid evidence file format detected');
                return res.status(400).json({ error: 'Invalid evidence file format' });
            }

            kpi.evidenceFiles = evidenceFiles;
            console.log('Evidence files updated successfully');
        }

        // Update other fields if provided
        if (typeof title !== 'undefined') kpi.title = title;
        if (typeof description !== 'undefined') kpi.description = description;
        if (typeof category !== 'undefined') kpi.category = category;
        if (typeof priority !== 'undefined') kpi.priority = priority;
        if (typeof startDate !== 'undefined') kpi.startDate = startDate;
        if (typeof dueDate !== 'undefined') kpi.dueDate = dueDate;
        if (assignedTo) kpi.assignedTo = assignedTo;
        if (assignedBy) kpi.assignedBy = assignedBy;

        console.log('Saving KPI with updates:', {
            id: kpi.id,
            progress: kpi.progress,
            status: kpi.status,
            commentsCount: kpi.comments.length,
            evidenceFilesCount: kpi.evidenceFiles.length
        });

        // Save the updated KPI
        const updatedKPI = await kpi.save();
        
        console.log('KPI saved successfully:', {
            id: updatedKPI.id,
            progress: updatedKPI.progress,
            status: updatedKPI.status,
            evidenceFilesCount: updatedKPI.evidenceFiles.length
        });

        // Return the updated KPI
        res.json(updatedKPI);
    } catch (err) {
        console.error('Error updating KPI:', err);
        console.error('Error stack:', err.stack);
        res.status(500).json({ 
            error: err.message || 'Internal server error',
            details: err.stack
        });
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

        console.log('VERIFY BODY:', { id, status, comment });

        const kpi = await KPI.findOne({ id });
        if (!kpi) return res.status(404).json({ error: 'KPI not found' });

        // Ensure status is valid
        if (!['Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid verification status' });
        }

        // Set status
        kpi.verifyStatus = status;

        // Add manager comment if provided
        if (comment && comment.trim()) {
            const newComment = {
                text: comment.trim(),
                date: new Date().toISOString(),
                progress: 100,
                isFinal: true,
                by: 'Manager'
            };

            // Validate before pushing
            if (!newComment.text) {
                return res.status(400).json({ error: 'Final comment is required' });
            }

            // Ensure comments array exists
            kpi.comments = Array.isArray(kpi.comments) ? kpi.comments : [];
            kpi.comments.push(newComment);
        }

        await kpi.save();
        res.status(200).json(kpi);
    } catch (err) {
        console.error('Error verifying KPI:', err);
        res.status(500).json({ error: err.message || 'Internal server error' });
    }
};

exports.getKPIsByStaffId = async (req, res) => {
    const { staffId } = req.params;

    try {
        const kpis = await KPI.find({ 'assignedTo.staffId': staffId });
        res.json(kpis);
    } catch (err) {
        console.error('Error fetching KPIs:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
