const pool = require('../config/db');

// Función para encontrar un usuario por correo electrónico
const findUserByEmail = async (email) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  } catch (err) {
    console.error('Error al buscar el usuario:', err);
    throw err;
  }
};

module.exports = { findUserByEmail };
