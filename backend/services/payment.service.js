import crypto from "crypto";

// flutterwave payment service, check env for credentials..

export const paymentService = {
  /**
   * Generates a payment link using Flutterwave v3 standard API
   */
  async generatePaymentLink({
    tx_ref,
    amount,
    currency,
    redirect_url,
    customer,
    customizations,
  }) {
    try {
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
        body: JSON.stringify({
          tx_ref,
          amount,
          currency,
          redirect_url,
          customer,
          customizations,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to generate payment link");
      }

      return data.data.link;
    } catch (error) {
      console.error("Flutterwave Initiation Error:", error);
      throw error;
    }
  },

  /**
   * Verifies a completed transaction
   */
  async verifyTransaction(transactionId) {
    try {
      const response = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Verification failed");
      }

      return data.data; // { status, amount, currency, tx_ref, etc. }
    } catch (error) {
      console.error("Flutterwave Verification Error:", error);
      throw error;
    }
  },

  /**
   * Validates Flutterwave webhook signature
   * @param {string} signature - webhook signature from headers 'verif-hash'
   * @returns {boolean} - true if signature matches env secret
   */
  verifyWebhookSignature(signature) {
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
    if (!secretHash || !signature) return false;

    return signature === secretHash;
  },

  /**
   * Tests the Flutterwave API connection
   * Calls the /virtual-banks endpoint to verify credentials work
   */
  async testConnection() {
    try {
      const response = await fetch("https://api.flutterwave.com/v3/banks/NG", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to connect to Flutterwave");
      }

      return {
        status: "connected",
        latency: 0,
        message: "Flutterwave connection successful",
        bankCount: data.data?.length || 0
      };
    } catch (error) {
      console.error("Flutterwave Connection Test Error:", error);
      throw error;
    }
  },
};
