const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  const users = await User.getUsers();
  res.send(users);
}

exports.getUser = async (userId) => {
  const user = await User.findUserById(userId);
  return user;
}

exports.getUserRoles = async (userId) => {
  const userRoles = await User.getUserRoles(userId);
  return userRoles;
}

exports.getFunctionsByUser = async (user) => {
  const functions = await User.getUserRoleFunctions(user);
  return functions;
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