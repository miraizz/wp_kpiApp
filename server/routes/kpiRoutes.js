const express = require('express');
const router = express.Router();
const {
    getAllKPIs,
    getKPIById,
    createKPI,
    updateKPI,
    deleteKPI
} = require('../controllers/kpiController');

// Route: /api/kpis
router.get('/', getAllKPIs);
router.get('/:id', getKPIById);
router.post('/', createKPI);
router.put('/:id', updateKPI);
router.delete('/:id', deleteKPI);

module.exports = router;
