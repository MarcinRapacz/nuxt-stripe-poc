import { loadStripe } from "@stripe/stripe-js";

export default defineNuxtPlugin({
  name: "stripe",
  parallel: true,
  async setup() {
    const config = useRuntimeConfig();
    const stripePlugin = await loadStripe(config.public.STRIPE);

    return {
      provide: {
        stripe: stripePlugin,
      },
    };
  },
});
