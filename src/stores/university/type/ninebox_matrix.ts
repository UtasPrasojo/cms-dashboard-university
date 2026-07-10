import { z } from "@/utils/validate";

export const nineboxMatrixSchema = z.object({
  data: z.array(
    z.array(
      z.string().nullable()
    )
  ),
  message: z.string(),
  error: z.unknown(),
});

export type NineBoxMatrixResponse = z.infer<typeof nineboxMatrixSchema>;