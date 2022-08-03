const {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
  getMonthlyIncome,
} = require("../controllers/order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await updateOrder(req.params.id, req.body);
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.status(200);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await getUserOrders(req.params.userId);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await getMonthlyIncome(previousMonth);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
