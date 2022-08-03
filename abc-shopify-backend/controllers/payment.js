const stripe = require("stripe")(process.env.STRIPE_KEY);

module.exports.createPayment = async (tokenId, amount) => {
  stripe.charges.create(
    {
      source: tokenId,
      amount: amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        throw stripeErr;
      } else {
        return stripeRes;
      }
    }
  );
};
