const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar JWT
exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

// Middleware para verificar roles
exports.checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).send('Access denied');
  next();
};
