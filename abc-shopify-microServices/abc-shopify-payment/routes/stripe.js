const router = require("express").Router();
const KEY = process.env.STRIPE_KEY;
const stripe = require("stripe")(
  "sk_test_51KxJM8IjQ0cM8ITEUdcaPY21T42HOKqpSHPCYsPikiuLRK6Dpgaoex7USCbaeZlwDyUsEmUne8CfmF1XIGauC6LZ00qkfiy4AS"
);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
