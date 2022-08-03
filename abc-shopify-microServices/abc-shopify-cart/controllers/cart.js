const Cart = require("../models/Cart");

module.exports.createCart = async (data) => {
  const newCart = new Cart(data);
  const savedCart = await newCart.save();
  return savedCart;
};

module.exports.updateCart = async (id, data) => {
  const updatedCart = await Cart.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    { new: true }
  );
  return updatedCart;
};

module.exports.deleteCart = async (id) => {
  await Cart.findByIdAndDelete(id);
  return true;
};

module.exports.getUserCart = async (userId) => {
  const cart = await Cart.findOne({ userId: userId });
  return cart;
};

module.exports.getAllCarts = async () => {
  const carts = await Cart.find();
  return carts;
};
