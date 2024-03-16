const express = require('express');
const router = express.Router();
const healthMetricsController = require('../../controllers/patient/healthMetrics');

// Upload health metrics
router.post('/upload/:patientId', healthMetricsController.uploadHealthMetrics);

// Get health metrics
router.get('/get/:patientId', healthMetricsController.getHealthMetrics);

// Update health metrics
router.put('/update/:healthMetricsId', healthMetricsController.updateHealthMetrics);

// Delete health metrics
router.delete('/delete/:healthMetricsId', healthMetricsController.deleteHealthMetrics);

module.exports = router;
