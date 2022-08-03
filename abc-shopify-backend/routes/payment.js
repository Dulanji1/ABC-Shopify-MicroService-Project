const { createPayment } = require("../controllers/payment");
const router = require("express").Router();

router.post("/payment", async (req, res) => {
  try {
    const payment = await createPayment(req.body.tokenId, req.body.amount);
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
