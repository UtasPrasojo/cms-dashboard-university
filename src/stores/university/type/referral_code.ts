import { z } from "@/utils/validate";

export const referralCodeSchema = z.object({
  id: z.string(),
  code: z.string(),
});

export const referralCodeResponseSchema = z.object({
  data: referralCodeSchema,
  message: z.string(),
  error: z.string().nullable(),
});

export type ReferralCode = z.infer<typeof referralCodeSchema>;
export type ReferralCodeResponse = z.infer<typeof referralCodeResponseSchema>;