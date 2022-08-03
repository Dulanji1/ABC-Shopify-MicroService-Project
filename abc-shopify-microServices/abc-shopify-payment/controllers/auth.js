const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.createUser = async (data) => {
  const newUser = new User({
    username: data.username,
    email: data.email,
    password: CryptoJS.AES.encrypt(
      data.password,
      process.env.PASS_SEC
    ).toString(),
  });
  return await newUser.save();
};

module.exports.signUserIn = async (data) => {
  const user = await User.findOne({
    username: data.username,
  });

  if (!user) throw new Error("Invalid user");

  const hashedPassword = CryptoJS.AES.decrypt(
    user.password,
    process.env.PASS_SEC
  );

  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

  if (originalPassword !== data.password)
    throw new Error("Passwords do not match");

  const accessToken = jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SEC,
    { expiresIn: "3d" }
  );

  const { password, ...others } = user._doc;
  return { ...others, accessToken, test: { response: "done" } };
};
