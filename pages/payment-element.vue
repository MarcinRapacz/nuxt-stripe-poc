<script lang="ts" setup>
const { data } = await useFetch("/stripe", { method: "post" });

const stripe = useNuxtApp().$stripe;

// if (!stripe || !data.value?.clientSecret) throw new Error();
const elements = stripe?.elements({
  appearance: { theme: "stripe" },
  clientSecret: data.value.clientSecret,
});

async function handleSubmit(e: any) {
  e.preventDefault();
  if (!stripe) throw new Error();

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: "http://nuxt-stripe-poc.vercel.app/success",
    },
  });

  console.log(error);
}

onMounted(() => {
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
  <button @click="handleSubmit">Submit</button>
</template>
