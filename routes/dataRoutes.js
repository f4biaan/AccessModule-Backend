const express = require('express');
const router = express.Router();
const { getUserRoles, getUser, getUsers, addUserRol, deleteUserRol, getFunctionsByUser } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { findUserByEmail } = require('../models/userModel');

router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/user', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.query.user, 10); // Obtener el user Id desde la query string

    if (isNaN(userId)) {
      return res.status(400).send('El ID de usuario no es válido');
    }

    const user = await getUser(userId);
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/userdata', async (req, res) => {
  try {
    const user = req.query.user; // Obtener el user Id desde la query string
    if (!user) {
      return res.status(400).send('El usuario no es válido');
    }

    const userData = await findUserByEmail(user);
    res.send({ id: userData.id, name: userData.name });
    
    
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/getroles', authenticateToken, async (req, res) => {
  try {
    const user = parseInt(req.query.user, 10); // Obtener el user Id desde la query string

    if (isNaN(user)) {
      return res.status(400).send('El ID de usuario no es válido');
    }

    const roles = await getUserRoles(user);
    res.send(roles);
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * @function getFunctiosByRoles
 * @description get all functions by user roles
 * @param {number} user - user id
 * @param { object} roles - list of roles
 * @returns {object} - return a list of functions
 */
router.get('/userfunctions', authenticateToken, async (req, res) => {
  try {
    const user = parseInt(req.query.user, 10); // Obtener el user Id desde la query string
    if (isNaN(user)) {
      return res.status(400).send('El ID de usuario no es válido');
    }

    const roles = await getFunctionsByUser(user);
    res.send(roles);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/addrole', authenticateToken, addUserRol);

router.delete('/deleterole', authenticateToken, deleteUserRol);

module.exports = router;
