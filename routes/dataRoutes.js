const express = require('express');
const router = express.Router();
const { getUserRoles, getUser, addUserRol, deleteUserRol } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authMiddleware');

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

router.post('/addrole', authenticateToken, addUserRol);

router.delete('/deleterole', authenticateToken, deleteUserRol);

module.exports = router;