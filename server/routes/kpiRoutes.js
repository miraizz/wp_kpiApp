const express = require('express');
const router = express.Router();
const {
    getAllKPIs,
    getKPIById,
    createKPI,
    updateKPI,
    deleteKPI,
    getPendingKPIs,
    verifyKPI,
    getKPIsByStaffId
} = require('../controllers/kpiController');

// Route: /api/kpis
// ✅ Specific routes first
router.get('/verify', getPendingKPIs);
router.put('/verify/:id', verifyKPI);
router.get('/staff/:staffId', getKPIsByStaffId);

// ✅ Generic routes after
router.get('/', getAllKPIs);
router.post('/', createKPI);
router.put('/:id', updateKPI);
router.delete('/:id', deleteKPI);
router.get('/:id', getKPIById); // ⚠️ Must come last!

module.exports = router;
