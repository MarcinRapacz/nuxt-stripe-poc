<script lang="ts" setup>
const { data } = await useFetch("/stripe", { method: "post" });

onMounted(() => {
  const stripe = useNuxtApp().$stripe;

  if (!stripe || !data.value?.clientSecret) throw new Error();
  const elements = stripe.elements({
    appearance: { theme: "stripe" },
    clientSecret: data.value.clientSecret,
  });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
});
</script>

<template>
  <h1>Payment Element</h1>
  <div id="payment-element" />
</template>
