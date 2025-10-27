import api from "./api";

export interface SocialAccount {
  id: string;
  provider: string;
  providerId: string;
  createdAt: string;
}

export interface SocialAccountsResponse {
  socialAccounts: SocialAccount[];
  total: number;
}

export const socialAccountService = {
  async getSocialAccounts(): Promise<SocialAccountsResponse> {
    const response = await api.get("/social-accounts");
    return response.data;
  },

  async unlinkSocialAccount(provider: string): Promise<{ message: string }> {
    const response = await api.delete(`/social-accounts/${provider}`);
    return response.data;
  },
};
