const CryptoJS = require("crypto-js");
const User = require("../models/User");

module.exports.updateUser = async (userId, data) => {
  if (data.password) {
    data.password = CryptoJS.AES.encrypt(
      data.password,
      process.env.JWT_SECRET
    ).toString();
  }

  return await User.findByIdAndUpdate(
    userId,
    {
      $set: data,
    },
    { new: true }
  );
};

module.exports.deleteUser = async (userId) => {
  await User.findByIdAndDelete(userId);
  return true;
};

module.exports.getUser = async (userId) => {
  const user = await User.findById(userId);
  const { password, ...others } = user._doc;
  return others;
};

module.exports.getAllUsers = async (newUsers) => {
  const users = newUsers
    ? await User.find().sort({ _id: -1 }).limit(5)
    : await User.find();
  return users;
};

module.exports.getStats = async (lastYear) => {
  const data = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: 1 },
      },
    },
  ]);
  return data;
};
