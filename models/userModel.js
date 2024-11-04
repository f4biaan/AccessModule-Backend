const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Función para encontrar usuario por email
const findUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

// Función para crear un nuevo usuario
const createUser = async (email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await pool.query(
    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING *',
    [email, hashedPassword, role]
  );
  return rows[0];
};

module.exports = { findUserByEmail, createUser };
