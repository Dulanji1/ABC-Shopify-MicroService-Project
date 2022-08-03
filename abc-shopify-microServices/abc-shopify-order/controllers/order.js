const Order = require("../models/Order");

module.exports.createOrder = async (data) => {
  const newOrder = new Order(data);
  const savedOrder = await newOrder.save();
  return savedOrder;
};

module.exports.updateOrder = async (id, data) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    { new: true }
  );

  return updatedOrder;
};

module.exports.deleteOrder = async (id) => {
  await Order.findByIdAndDelete(id);
  return true;
};

module.exports.getUserOrders = async (userId) => {
  const orders = await Order.find({ userId: userId });
  return orders;
};

module.exports.getAllOrders = async () => {
  const orders = await Order.find();
  return orders;
};

module.exports.getMonthlyIncome = async (previousMonth) => {
  const income = await Order.aggregate([
    { $match: { createdAt: { $gte: previousMonth } } },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$amount",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);
  return income;
};
