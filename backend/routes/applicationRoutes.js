// backend/routes/applicationRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicationController');

// Hoca Kuralı: Standart HTTP metotları kullanılmalıdır[span_3](end_span).
// Bu rotalar, az önce yazdığımız controller fonksiyonlarını tetikler.

router.post('/', controller.createApplication);       
router.get('/', controller.getApplications);          
router.put('/:id', controller.updateApplication);     
router.delete('/:id', controller.deleteApplication);  

module.exports = router;