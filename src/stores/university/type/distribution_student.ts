import { z } from "@/utils/validate";

export const paginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  total: z.number(),
});

export const distributionStudentItemSchema = z.object({
  major: z.string(),
  faculty: z.string(),
  total_student: z.coerce.number(),
  total_cv_completed: z.coerce.number(),
  total_completed_assessment: z.coerce.number(),
  total_active_talent_pool: z.coerce.number(),
});

export const distributionStudentSchema = z.object({
  pagination: paginationSchema,
  items: z.array(distributionStudentItemSchema),
});

export const distributionStudentResponseSchema = z.object({
  data: distributionStudentSchema,
  message: z.string(),
  error: z.unknown(),
});

export type Pagination = z.infer<typeof paginationSchema>;
export type DistributionStudent = z.infer<typeof distributionStudentItemSchema>;
export type DistributionStudentData = z.infer<typeof distributionStudentSchema>;
export type DistributionStudentResponse = z.infer<typeof distributionStudentResponseSchema>;