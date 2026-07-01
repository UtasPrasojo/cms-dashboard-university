import { z } from 'zod'

export type InferSchema<T extends z.ZodType> = z.infer<T>

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> }

export function validate<T extends z.ZodType>(
  schema: T,
  data: unknown,
): ValidationResult<z.infer<T>> {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  }

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || 'root'
    errors[key] = issue.message
  }

  return { success: false, errors }
}

export function createSchema<T extends z.ZodRawShape>(shape: T): z.ZodObject<T> {
  return z.object(shape)
}

export { z }
