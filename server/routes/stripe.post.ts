import Stripe from "stripe";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const stripe = new Stripe(runtimeConfig.STRIPE_SECRET);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 215,
    currency: "pln",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    message: "ok",
    clientSecret: paymentIntent.client_secret,
  };
});
