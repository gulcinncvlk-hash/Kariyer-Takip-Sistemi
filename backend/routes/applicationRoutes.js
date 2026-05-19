// backend/routes/applicationRoutes.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/applicationController');
const verifyToken = require('../middlewares/authMiddleware');
// Hoca Kuralı: Standart HTTP metotları kullanılmalıdır[span_3](end_span).
// Bu rotalar, az önce yazdığımız controller fonksiyonlarını tetikler.

router.post('/',verifyToken, controller.createApplication);       
router.get('/',verifyToken, controller.getApplications);          
router.put('/:id',verifyToken, controller.updateApplication);     
router.delete('/:id',verifyToken, controller.deleteApplication);  

module.exports = router;