import { z } from "@/utils/validate";

export const archetypeSchema = z.object({
  code: z.string(),
  name: z.string(),
  description: z.string(),
  total: z.string(),
});

export const archetypePersonalityResponseSchema = z.object({
  data: z.array(archetypeSchema),
  message: z.string(),
  error: z.unknown(),
});

export type ArchetypePersonality = z.infer<typeof archetypeSchema>;
export type ArchetypePersonalityResponse = z.infer<typeof archetypePersonalityResponseSchema>;