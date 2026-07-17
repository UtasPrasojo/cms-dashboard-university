import { z } from "@/utils/validate"

export interface StudentArchetype {
    archetype_id: string
    name: string
    description: string
    distance: number
    code: string
    matchPercentage: number
    rank: number
}

export interface StudentItem {
    id: string
    name: string
    email: string
    usi: string
    cohort: string
    education_level: string
    faculty: string
    major: string
    archetype: StudentArchetype[] | null
    ninebox: [number, number] | null
}

export interface Pagination {
    page: number
    size: number
    total: number
}

export interface StudentListData {
    pagination: Pagination
    items: StudentItem[]
}

export interface StudentListResponse {
    status: number
    data: StudentListData
    message: string
    error: string | null
}

export interface StudentFilter {
    page: number
    size: number
    total: number
    search: string
    sortBy: string
    orderBy: string
    facultyIds: string[]
    majorIds: string[]
    nineBoxPositions: string[]
    archetypes: string[]
}

export interface GetStudentParams {
    page?: number
    size?: number
    search?: string
    sortBy?: string
    orderBy?: string
    facultyIds?: string[]
    majorIds?: string[]
    nineBoxPositions?: string[]
    archetypes?: string[]
}

export const createStudentSchema = z.object({
    name: z.string().trim()
        .min(1, "Nama mahasiswa wajib diisi")
        .max(150, "Nama mahasiswa maksimal 150 karakter"),
    gender: z.enum(["Laki-laki", "Perempuan"], "Jenis kelamin wajib dipilih"),
    email: z.email("Format email tidak valid")
        .min(1, "Email wajib diisi"),
    cohort: z.string().trim()
        .regex(/^\d{4}$/, "Angkatan harus berupa 4 digit tahun, contoh: 2024"),
    usi: z.string().trim()
        .min(1, "NIM wajib diisi")
        .max(30, "NIM maksimal 30 karakter"),
    faculty_id: z.string().min(1, "Fakultas wajib dipilih"),
    major_id: z.string().min(1, "Program studi wajib dipilih"),
})

export type CreateStudentPayload = z.infer<typeof createStudentSchema>

export const IMPORT_STUDENT_MAX_SIZE = 5 * 1024 * 1024 // 5MB
export const IMPORT_STUDENT_EXTENSION = ".csv"

export const importStudentFileSchema = z.object({
    file: z.instanceof(File, { message: "File wajib diunggah" })
        .refine((file) => file.size > 0, "File tidak boleh kosong")
        .refine((file) => file.size <= IMPORT_STUDENT_MAX_SIZE, "Ukuran file melebihi 5MB")
        .refine(
            (file) => file.name.toLowerCase().endsWith(IMPORT_STUDENT_EXTENSION),
            "Format file tidak valid. Harap upload file CSV"
        ),
})

export type ImportStudentFile = z.infer<typeof importStudentFileSchema>

export const importStudentResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    error: z.unknown().nullable().optional(),
    data: z.unknown().optional(),
})

export type ImportStudentResponse = z.infer<typeof importStudentResponseSchema>

// Backend for csv-template may respond with either the raw CSV body or a
// JSON envelope wrapping it in `data`, so both shapes are accepted here.
export const csvTemplateResponseSchema = z.union([
    z.string().min(1, "Template tidak ditemukan"),
    z.object({ data: z.string().min(1, "Template tidak ditemukan") }),
])

export type CsvTemplateResponse = z.infer<typeof csvTemplateResponseSchema>

export interface ManagementStudentState {
    students: StudentItem[]
    filter: StudentFilter
    loading: boolean
    error: string | null
}