const Product = require("../models/Product");

module.exports.createProduct = async (data) => {
  const newProduct = new Product(data);
  const savedProduct = await newProduct.save();
  return savedProduct;
};

module.exports.updateProduct = async (id, data) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: data,
    },
    { new: true }
  );
  return updatedProduct;
};

module.exports.deleteProduct = async (id) => {
  await Product.findByIdAndDelete(id);
  return true;
};

module.exports.getProduct = async (id) => {
  const product = await Product.findById(id);
  return product;
};

module.exports.getAllProducts = async (qNew, qCategory) => {
  let products;
  if (qNew) {
    products = await Product.find().sort({ createdAt: -1 }).limit(1);
  } else if (qCategory) {
    products = await Product.find({
      categories: {
        $in: [qCategory],
      },
    });
  } else {
    products = await Product.find();
  }
  return products;
};
