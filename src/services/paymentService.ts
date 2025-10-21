const API_URL =
  import.meta.env.VITE_API_URL || "https://authbase-pro.onrender.com/api";

export const paymentService = {
  async getPricing() {
    const response = await fetch(`${API_URL}/payments/pricing`);
    return response.json();
  },

  async createCheckoutSession(
    tier: "basic" | "pro" | "enterprise",
    email: string
  ) {
    console.log("🚀 Starting checkout process...");
    console.log("Tier:", tier);
    console.log("Email:", email);
    console.log("API URL:", API_URL);

    try {
      const response = await fetch(`${API_URL}/payments/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, email }),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (data.checkoutUrl) {
        console.log("🔗 Redirecting to Stripe:", data.checkoutUrl);
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl;
      } else {
        console.log("❌ No checkoutUrl in response");
        console.log("Available keys:", Object.keys(data));
      }

      return data;
    } catch (error) {
      console.error("💥 Fetch error:", error);
      throw error;
    }
  },

  async verifyLicense(key: string) {
    // For now, mock verification since database is disabled
    console.log("License verification for:", key);
    return { valid: true, tier: "pro", expiresAt: "2024-12-31" };
  },
};
