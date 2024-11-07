const User = require('../models/userModel');


exports.getUser = async (userId) => {
  const user = await User.findUserById(userId);
  return user;
}

exports.getUserRoles = async (userId) => {
  const userRoles = await User.getUserRoles(userId);
  return userRoles;
}

exports.addUserRol = async (req, res) => {
  const { user, role } = req.body;
  const userRol = await User.addUserRol(user, role);
  res.status(201).json({ message: 'Rol added', userRol });
}

exports.deleteUserRol = async (req, res) => {
  const { user, role } = req.body;
  const userRol = await User.deleteUserRol(user, role);
  res.status(201).json({ message: 'Rol deleted', userRol });
}