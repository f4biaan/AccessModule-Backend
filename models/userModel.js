const bcrypt = require('bcrypt');
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

// Función para crear un nuevo usuario
const createUser = async (name, email, password, role) => {
  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, role]
    );

    return rows[0]; // Devuelve el usuario creado
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    throw err;
  }
};

module.exports = { findUserByEmail, createUser };
