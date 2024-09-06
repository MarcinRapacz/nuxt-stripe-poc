<script setup lang="ts">
const stripe = useNuxtApp().$stripe;
const elements = stripe?.elements({
  mode: "payment",
  amount: 555,
  currency: "pln",
  paymentMethodCreation: "manual",
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
});

onMounted(() => {
  // Create and mount the Payment Element
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
});

async function onSubmit(event: any) {
  // We don't want to let default form submission happen here,
  // which would refresh the page.
  event.preventDefault();

  // Trigger form validation and wallet collection
  const { error: submitError } = await elements.submit();
  if (submitError) {
    console.log("submitError", submitError);

    return;
  }

  // Create the PaymentMethod using the details collected by the Payment Element
  const { error, paymentMethod } = await stripe.createPaymentMethod({
    elements,
  });

  if (error) {
    // This point is only reached if there's an immediate error when
    // creating the PaymentMethod. Show the error to your customer (for example, payment details incomplete)
    console.log("paymentMethodError", error);

    return;
  }

  console.log(paymentMethod);

  // Create the PaymentIntent
  // const res = await fetch("/create-confirm-intent", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     paymentMethodId: paymentMethod.id,
  //   }),
  // });

  // const data = await res.json();

  // // Handle any next actions or errors. See the Handle any next actions step for implementation.
  // handleServerResponse(data);
}

const handleServerResponse = async (response) => {
  if (response.error) {
    // Show error from server on payment form
  } else if (response.status === "requires_action") {
    // Use Stripe.js to handle the required next action
    const { error, paymentIntent } = await stripe.handleNextAction({
      clientSecret: response.clientSecret,
    });

    if (error) {
      console.log("@@handleServerResponse error", error);

      // Show error from Stripe.js in payment form
    } else {
      console.log("@@@handleServerResponse success");

      // Actions handled, show success message
    }
  } else {
    console.log("@@handleServerResponse no action");

    // No actions needed, show success message
  }
};
</script>

<template>
  <form id="payment-form" @submit="onSubmit">
    <div id="payment-element">
      <!-- Elements will create form elements here -->
    </div>
    <button id="submit">Submit to server</button>
    <div id="error-message">
      <!-- Display error message to your customers here -->
    </div>
  </form>
</template>
