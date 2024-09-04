import { loadStripe } from "@stripe/stripe-js";

export default defineNuxtPlugin({
  name: "stripe",
  parallel: true,
  async setup() {
    const config = useRuntimeConfig();

    config.public.STRIPE_PUBLIC;
    const stripePlugin = await loadStripe(config.public.STRIPE_PUBLIC);

    return {
      provide: {
        stripe: stripePlugin,
      },
    };
  },
});
