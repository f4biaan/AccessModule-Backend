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

// Función para encontrar un usuario por ID
const findUserById = async (userId) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return rows[0];
  } catch (err) {
    console.error('Error al buscar el usuario:', err);
    throw err;
  }
};

// Función para crear un nuevo usuario
const createUser = async (name, email, password) => {
  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    await pool.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
      [rows[0].id, 'ROL_U']
    );

    rows[0].role = ['ROL_U'];

    return rows[0]; // Devuelve el usuario creado
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    throw err;
  }
};

// Función para obtener los roles del usuario
const getUserRoles = async (userId) => {
  try {
    if (!pool) throw new Error("No hay conexión con la base de datos");
    const { rows } = await pool.query(
      `SELECT r.id, r.name, r.description
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1`,
      [userId]
    );
    return rows;
  } catch (err) {
    console.error('Error al buscar los roles del usuario:', err.stack || err);
    throw err;
  }
};

// Función para actualizar los roles del usuario
// table users (id, name, email, password, role) table roles (id, name, description) table user_roles (user_id, role_id) table role_functions (role_id, function_id) table functions (id, name, description)
// recieve an rol and an user id
const addUserRol = async (user, role) => {
  try {
    if (!pool) throw new Error("No hay conexión con la base de datos");

    // Verificar si ya existe el registro
    const { rowCount } = await pool.query(
      `SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2`,
      [user, role]
    );

    if (rowCount > 0) {
      return { status: "exists", message: "El rol ya existe para el usuario." };
    }

    // Si no existe, insertar el nuevo registro
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)`,
      [user, role]
    );

    return { status: "success", message: "Rol asignado al usuario exitosamente." };
  }
  catch (err) {
    console.error('Error al asignar el rol al usuario:', err.stack || err);
    throw err;
  }
}

const deleteUserRol = async (user, role) => {
  try {
    if (!pool) throw new Error("No hay conexión con la base de datos");

    // Verificar si ya existe el registro
    const { rowCount } = await pool.query(
      `SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2`,
      [user, role]
    );

    if (rowCount === 0) {
      return { status: "not exists", message: "El rol no existe para el usuario." };
    }

    // Si no existe, insertar el nuevo registro
    await pool.query(
      `DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2`,
      [user, role]
    );

    return { status: "success", message: "Rol eliminado del usuario exitosamente." };
  }
  catch (err) {
    console.error('Error al eliminar el rol del usuario:', err.stack || err);
    throw err;
  }
}


// Función para obtenert las funcinoalidades de los usaurios en base a sus roles
const getUserRoleFunctions = async (userId) => {
  try {
    const { rows } = await pool.query(
      `SELECT f.name, f.description
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      JOIN role_functions rf ON r.id = rf.role_id
      JOIN functions f ON rf.function_id = f.id
      WHERE u.id = $1`,
      [userId]
    );
    return rows;
  } catch (err) {
    console.error('Error al buscar las funciones del usuario:', err);
    throw err;
  }
}

module.exports = { findUserByEmail, createUser, getUserRoles, findUserById, addUserRol, deleteUserRol };
