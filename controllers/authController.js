const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const { findUserByEmail, createUser } = require('../models/userModel');
require('dotenv').config();

// Registro de usuario
exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  const user = await createUser(email, password, role);
  res.status(201).json({ message: 'User registered', user });
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
};

// Generar OTP para 2FA
exports.generate2FA = (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

  // Guardar el secreto en la base de datos si es necesario
  res.json({ token, secret: secret.base32 });
};

// Verificar OTP
exports.verify2FA = (req, res) => {
  const { token, secret } = req.body;
  const verified = speakeasy.totp.verify({ secret, encoding: 'base32', token });

  if (verified) {
    res.json({ message: '2FA verified' });
  } else {
    res.status(401).json({ message: 'Invalid OTP' });
  }
};
