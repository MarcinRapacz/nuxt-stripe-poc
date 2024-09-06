import Stripe from "stripe";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const runtimeConfig = useRuntimeConfig();
  const stripe = new Stripe(runtimeConfig.STRIPE_SECRET);

  try {
    const intent = await stripe.paymentIntents.create({
      confirm: true,
      amount: 555,
      currency: "pln",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: { enabled: true },
      payment_method: body.paymentMethodId, // the PaymentMethod ID sent by your client
      use_stripe_sdk: true,
      return_url: "https://nuxt-stripe-poc.vercel.app//success",
      mandate_data: {
        customer_acceptance: {
          type: "online",
          // online: {
          //   ip_address: req.ip,
          //   user_agent: req.get("user-agent"),
          // },
        },
      },
    });

    return {
      intent,
      client_secret: intent.client_secret,
      status: intent.status,
    };
  } catch (e) {
    return {
      success: false,
      message: JSON.stringify(e),
    };
  }
});
