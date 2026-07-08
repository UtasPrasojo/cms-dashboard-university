export interface ReferralCode {
  id: string;
  code: string;
}

export interface ReferralCodeResponse {
  data: ReferralCode;
  message: string;
  error: string | null;
}