import { z } from "@/utils/validate";

export const studentsSchema = z.object({
    total_registration: z.string(),
    previous_month_registration: z.string(),
    current_month_registration: z.string(),
    total_cv_completed: z.string(),
    total_completed_assessment: z.string(),
    total_active_talent_pool: z.string(),
});

export const percentageStatsSchema = z.object({
    students: studentsSchema,
});

export const percentageStatsResponseSchema = z.object({
    data: percentageStatsSchema,
    message: z.string(),
    error: z.unknown(),
});

export type Students = z.infer<typeof studentsSchema>;
export type PercentageStats = z.infer<typeof percentageStatsSchema>;
export type PercentageStatsResponse = z.infer<typeof percentageStatsResponseSchema>;