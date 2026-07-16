// src/stores/university/type/referral_code.ts
import { z } from "zod";

export const referralCodeSchema = z.object({
    id: z.number(),
    code: z.string(),
});

export const referralCodeResponseSchema = z.object({
    data: referralCodeSchema,
    message: z.string(),
    error: z.unknown().nullable(),
});

export type ReferralCode = z.infer<typeof referralCodeSchema>;
export type ReferralCodeResponse = z.infer<typeof referralCodeResponseSchema>;