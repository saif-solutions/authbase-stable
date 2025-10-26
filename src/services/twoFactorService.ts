import api from "./api";

export interface TwoFASetupResponse {
  success: boolean;
  secret: string;
  qrCode: string;
  message: string;
}

export interface TwoFAEnableResponse {
  success: boolean;
  message: string;
  backupCodes: string[];
  warning: string;
}

export interface TwoFAVerifyResponse {
  message: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface TwoFALoginResponse {
  message: string;
  requires2FA: boolean;
  temp2FAToken: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
}

class TwoFactorService {
  // Start 2FA setup process
  async setup2FA(): Promise<TwoFASetupResponse> {
    const response = await api.post("/auth/2fa/setup");
    return response.data;
  }

  // Enable 2FA with verification code
  async enable2FA(token: string): Promise<TwoFAEnableResponse> {
    const response = await api.post("/auth/2fa/enable", { token });
    return response.data;
  }

  // Verify 2FA code during login
  async verify2FA(
    temp2FAToken: string,
    token: string
  ): Promise<TwoFAVerifyResponse> {
    const response = await api.post("/auth/2fa/verify", {
      temp2FAToken,
      token,
    });
    return response.data;
  }

  // Disable 2FA (we'll implement this later)
  async disable2FA(
    password: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/auth/2fa/disable", { password });
    return response.data;
  }

  // Generate new backup codes
  async generateBackupCodes(): Promise<{
    success: boolean;
    backupCodes: string[];
  }> {
    const response = await api.post("/auth/2fa/backup-codes");
    return response.data;
  }
}

export default new TwoFactorService();
