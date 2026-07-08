import { z } from "@/utils/validate";

export const paginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  total: z.number(),
});

export const distributionStudentItemSchema = z.object({
  major: z.string(),
  faculty: z.string(),
  total_student: z.number(),
  cv_summary: z.number(),
  assessment_summary: z.number(),
  career_readiness_summary: z.number(),
  alignment_interest_summary: z.number(),
  nine_box_summary: z.array(z.number()),
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
export type Item = z.infer<typeof distributionStudentItemSchema>;
export type DistributionStudent = z.infer<typeof distributionStudentSchema>;
export type DistributionStudentResponse = z.infer<typeof distributionStudentResponseSchema>;

export type PosisiNineBox =
  | 'prioritas intervensi'
  | 'bakat terpendam'
  | 'bintang berkembang'
  | 'pekerja keras berprestasi'
  | 'talent unggulan'
  | 'perlu pendampingan'
  | 'perlu dorongan'
  | 'profil solid'
  | 'tekun & konsisten'