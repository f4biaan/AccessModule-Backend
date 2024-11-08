const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para verificar JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrae solo el token después de "Bearer"
  
  if (!token) {
    return res.status(403).send('Token required');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error al verificar el token:', err.message); // Mensaje de depuración
      return res.status(403).send('Invalid token');
    }
    req.user = user; // Almacena el usuario decodificado en la solicitud
    next();
  });
};


// Middleware para verificar roles
exports.checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).send('Access denied');
  next();
};
