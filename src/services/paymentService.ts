const API_URL =
  import.meta.env.VITE_API_URL || "https://authbase-pro.onrender.com/api";

export const paymentService = {
  async getPricing() {
    const response = await fetch(`${API_URL}/payments/pricing`);
    return response.json();
  },

  async createCheckoutSession(
    tier: "test" | "basic" | "pro" | "enterprise", // Add "test" here
    email: string
  ) {
    const response = await fetch(`${API_URL}/payments/create-checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier, email }),
    });

    const data = await response.json();

    if (data.checkoutUrl) {
      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
    }

    return data;
  },

  async verifyLicense(key: string) {
    // For now, mock verification since database is disabled
    console.log("License verification for:", key);
    return { valid: true, tier: "pro", expiresAt: "2024-12-31" };
  },
};
