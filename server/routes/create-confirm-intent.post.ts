import Stripe from "stripe";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const runtimeConfig = useRuntimeConfig();
  const stripe = new Stripe(runtimeConfig.STRIPE_SECRET);

  try {
    const intent = await stripe.paymentIntents.create({
      confirm: true,
      amount: 1099,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: { enabled: true },
      payment_method: body.paymentMethodId, // the PaymentMethod ID sent by your client
      use_stripe_sdk: true,
      return_url: "https://example.com/order/123/complete",
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
