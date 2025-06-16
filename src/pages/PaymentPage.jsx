import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaymentPage = () => {
  const placeholderClientId = "sb"; // Using 'sb' as agreed

  // Mock createOrder function
  const createOrder = (data, actions) => {
    console.log("Creating order with data:", data);
    return actions.order.create({
      purchase_units: [{
        description: "Awesome Test Product Purchase",
        amount: {
          currency_code: "USD",
          value: "10.00",
        },
      }],
      // application_context: {
      //   shipping_preference: 'NO_SHIPPING', // Optional: if you don't need shipping
      // }
    }).then((orderID) => {
      console.log("Order ID created by PayPal:", orderID);
      return orderID;
    });
  };

  // Mock onApprove function
  const onApprove = (data, actions) => {
    console.log("Payment Approved data:", data);
    // The 'actions.order.capture()' is what you'd do to finalize the payment
    // For now, we just simulate success after approval.
    // return actions.order.capture().then(details => {
    //   alert("Payment successful! Transaction completed by: " + details.payer.name.given_name);
    //   console.log("Capture details:", details);
    // });
    alert("Payment Approved! Order ID: " + data.orderID + ". Payer ID: " + data.payerID);
    return Promise.resolve(); // Indicate asynchronous operation is complete
  };

  // Mock onError function
  const onError = (err) => {
    console.error("PayPal Checkout onError", err);
    alert("An error occurred with your PayPal payment. Please try again.");
  };

  // Mock onCancel function
  const onCancel = (data) => {
    console.log("PayPal Checkout onCancel", data);
    alert("Payment was cancelled.");
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
      <h1>Make a Payment</h1>
      <div style={{ marginTop: '30px', fontSize: '18px' }}>
        <p>You are paying for: <strong>Awesome Test Product</strong></p>
        <p>Amount: <strong>$10.00 USD</strong></p>

        <div style={{ marginTop: '40px', border: '1px dashed grey', padding: '20px', minHeight: '150px', maxWidth: '500px', margin: '40px auto' }}>
          <PayPalScriptProvider options={{ "client-id": placeholderClientId, currency: "USD" }}>
            <PayPalButtons
              style={{ layout: "vertical", color: "blue", shape: "rect", label: "paypal" }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
              onCancel={onCancel}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
