const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpiController');

// Route: /api/kpis
router.get('/', kpiController.getAllKPIs);
router.get('/:id', kpiController.getKPIById);
router.post('/', kpiController.createKPI);
router.put('/:id', kpiController.updateKPI);
router.delete('/:id', kpiController.deleteKPI);

module.exports = router;
