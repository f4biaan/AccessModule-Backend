const express = require('express');
const router = express.Router();
const { sendVerificationCode } = require('../controllers/emailController');

// Ruta para enviar el código de verificación por correo
router.post('/send-code', sendVerificationCode);

module.exports = router;
