import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axiosInstance from '../../api/axiosInstance'; // Added import

const PaymentPage = () => {
  // IMPORTANT: Replace "sb" with your actual PayPal App Client ID for production.
  // It's recommended to load this from an environment variable (e.g., process.env.REACT_APP_PAYPAL_CLIENT_ID).
  const placeholderClientId = "sb"; // Using 'sb' as agreed for sandbox testing

  // Implement createOrder function to call backend
  const createOrder = async () => {
    console.log("Attempting to create order via backend...");
    try {
      // Make a POST request to the backend endpoint
      const response = await axiosInstance.post('/api/subscriptions/create-order', {});
      console.log("Backend response:", response);

      if (response.data && response.data.orderID) {
        console.log("Order ID from backend:", response.data.orderID);
        return response.data.orderID;
      } else {
        // This case handles if backend responds without an orderID
        console.error("Backend response did not include an orderID.");
        alert("Could not initiate PayPal transaction. Order ID missing from backend response.");
        return null; // Or rethrow an error, depending on desired PayPal SDK behavior
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      // Log more detailed error information if available
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      alert("Could not initiate PayPal transaction. Please try again.");
      // Rethrow error or return null to prevent PayPal from proceeding
      // For now, returning null as PayPal SDK might handle it by showing an error.
      // Depending on PayPal's SDK error handling, rethrowing might be better.
      // throw error;
      return null;
    }
  };

  // Implement onApprove function to call backend for payment capture
  const onApprove = async (data, actions) => {
    console.log("PayPal payment approved. Data:", data);

    if (!data.orderID) {
      console.error("PayPal onApprove data is missing orderID.");
      alert("Payment approval error: Missing Order ID. Please contact support.");
      // It might be necessary to inform PayPal that the process cannot continue
      // depending on how the PayPal SDK handles unresolved promises or errors here.
      return; // Or throw new Error("Missing orderID in onApprove callback");
    }

    console.log(`Attempting to capture payment for orderID: ${data.orderID} via backend...`);
    try {
      // Make a POST request to the backend endpoint to capture the payment
      const response = await axiosInstance.post('/api/subscriptions/capture-payment', {
        orderID: data.orderID,
      });

      console.log("Backend /capture-payment response:", response);

      // Assuming backend responds with success (e.g., status 200) and relevant data
      if (response.status === 200 && response.data) {
        // Example: Backend might return subscription details or just a success message
        const responseData = response.data;
        console.log("Payment capture successful. Backend data:", responseData);

        // Display a success message to the user
        alert(responseData.message || "Payment successful! Your subscription is now active.");

        // Optionally, you might want to redirect the user or update UI state here
        // e.g., history.push('/subscription-success');

        // According to PayPal docs, for server-side capture, you don't call actions.order.capture() here.
        // The backend handles the capture. You just need to handle the response from your server.
        // If PayPal requires some client-side finalization even after server capture,
        // that would be specified in their SDK docs for this flow. For now, assume not needed.
      } else {
        // Handle cases where backend response is not as expected (e.g., status not 200 or data missing)
        console.error("Backend response indicates payment capture failure or unexpected format:", response);
        alert(response.data?.message || "Failed to finalize your subscription. Please contact support.");
      }
    } catch (error) {
      console.error("Error calling /capture-payment:", error);
      let alertMessage = "An error occurred while finalizing your payment. Please contact support.";
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        // Use backend error message if available
        alertMessage = error.response.data?.message || alertMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        alertMessage = "Could not connect to server to finalize payment. Please check your internet connection and try again.";
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
      alert(alertMessage);
      // Depending on the desired UX, you might want to inform PayPal about the failure
      // or guide the user appropriately. For now, an alert is shown.
      // throw error; // Rethrowing might trigger PayPal's onError, which could be desired.
    }
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
