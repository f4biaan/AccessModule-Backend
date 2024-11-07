const express = require('express');
const router = express.Router();
const { sendVerificationCode } = require('../controllers/emailController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');


// Ruta para enviar el código de verificación por correo
router.post('/send-code', authenticateToken, sendVerificationCode);

module.exports = router;
