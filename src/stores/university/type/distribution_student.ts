import { z } from "@/utils/validate";

export const distributionStudentItemSchema = z.object({
  major: z.string(),
  faculty: z.string(),
  total_student: z.coerce.number(),
  total_cv_completed: z.coerce.number(),
  total_completed_assessment: z.coerce.number(),
  total_active_talent_pool: z.coerce.number(),
});

export const distributionStudentResponseSchema = z.object({
  data: z.array(distributionStudentItemSchema),
  message: z.string(),
  error: z.unknown(),
});

export type DistributionStudent = z.infer<typeof distributionStudentItemSchema>;
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