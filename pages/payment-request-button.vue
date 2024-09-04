<script lang="ts" setup>
onMounted(async () => {
  const stripe = useNuxtApp().$stripe;

  if (!stripe) {
    throw new Error("stripe not found");
  }

  const paymentRequest = stripe.paymentRequest({
    country: "US",
    currency: "usd",
    total: {
      label: "Demo total",
      amount: 1099,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  const elements = stripe.elements();
  const prButton = elements.create("paymentRequestButton", {
    paymentRequest,
  });

  const result = await paymentRequest.canMakePayment();
  console.log("@@@result", result);

  if (result) {
    prButton.mount("#payment-request-button");
  } else {
    document.getElementById("payment-request-button").style.display = "none";
  }
});
</script>

<template>
  <h1>Payment Request Button</h1>
  <div id="payment-request-button" />
</template>
