const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const { findUserByEmail, createUser, getUserRoles } = require('../models/userModel');
const { checkRole } = require('../middlewares/authMiddleware');
require('dotenv').config();

// Registro de usuario
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar si el email ya existe
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'Email already exists' }); // Código 409 para conflictos
  }

  // Crear usuario si el email no está registrado
  const user = await createUser(name, email, password);
  res.status(201).json({ message: 'User registered', user });
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: 'Email not found' }); // Error por correo electrónico no encontrado
  }

  // Verificación de la contraseña
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Incorrect password' }); // Error por contraseña incorrecta
  }

  // Check if has sufficient role - verificar si tiene al menos el rol de usuario
  /* if (user.role === null) {
    return res.status(403).json({ message: 'Access denied:  Insufficient role' });
  } */

  const roles = await getUserRoles(user.id);
  if (!roles.some((role) => role.name === 'Rol Usuario')) {
    return res.status(403).json({ message: 'Access denied: Insufficient role' });
  }

  // Generar el token JWT
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Respuesta exitosa con el token
  res.json({ message: 'Login successful', token });
};


// Generar OTP para 2FA
exports.generate2FA = (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32', step: 180 });

  // Guardar el secreto en la base de datos si es necesario
  res.json({ token, secret: secret.base32 });
};

// Verificar OTP
exports.verify2FA = (req, res) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token, step: 180, window: 1 });

  if (verified) {
    res.json({ message: '2FA verified' });
  } else {
    res.status(401).json({ message: 'Invalid OTP' });
  }
};
