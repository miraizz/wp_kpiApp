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
router.get('/', getAllKPIs);
router.get('/:id', getKPIById);
router.post('/', createKPI);
router.put('/:id', updateKPI);
router.delete('/:id', deleteKPI);
router.get('/verify', getPendingKPIs);
router.put('/verify/:id', verifyKPI);
router.get('/staff/:staffId', getKPIsByStaffId);

module.exports = router;
