const User = require("../models/User");

const getAllUsers = async () => {
  return await User.find().select("-password");
};

const getUserById = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const updateUserRole = async (id, role) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.role = role;
  await user.save();

  return user;
};

const updateUserStatus = async (id, status) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.status = status;
  await user.save();

  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
};
