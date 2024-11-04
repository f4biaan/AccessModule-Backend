const express = require('express');
const { register, login, generate2FA, verify2FA } = require('../controllers/authController');
const { authenticateToken, checkRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/generate-2fa', authenticateToken, generate2FA); // Debe estar autenticado para 2FA
router.post('/verify-2fa', authenticateToken, verify2FA);

module.exports = router;
