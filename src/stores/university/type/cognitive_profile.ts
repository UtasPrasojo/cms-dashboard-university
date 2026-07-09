import { z } from "@/utils/validate";

export const detailCognitiveProfileSchema = z.object({
  ccat_group_id: z.string(),
  name: z.string(),
  avg_score: z.string(),
  min_score: z.string(),
  max_score: z.string(),
});

export const cognitiveProfileSchema = z.object({
  avg_score: z.string(),
  details: z.array(detailCognitiveProfileSchema),
});

export const cognitiveProfileResponseSchema = z.object({
  data: cognitiveProfileSchema,
  message: z.string(),
  error: z.unknown(),
});

export type DetailCognitiveProfile = z.infer<typeof detailCognitiveProfileSchema>;
export type CognitiveProfile = z.infer<typeof cognitiveProfileSchema>;
export type CognitiveProfileResponse = z.infer<typeof cognitiveProfileResponseSchema>;