const {
  createCart,
  updateCart,
  deleteCart,
  getUserCart,
  getAllCarts,
} = require("../controllers/cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  try {
    const cart = await createCart(req.body);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await updateCart(req.params.id, req.body);
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const response = await deleteCart(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await getUserCart(req.params.userId);
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await getAllCarts();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
