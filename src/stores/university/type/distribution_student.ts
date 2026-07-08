export interface DistributionStudentResponse {
  data: DistributionStudent
  message: string
  error: any
}

export interface DistributionStudent {
  pagination: Pagination
  items: Item[]
}

export interface Pagination {
  page: number
  size: number
  total: number
}

export interface Item {
  major: string
  faculty: string
  total_student: number
  cv_summary: number
  assessment_summary: number
  career_readiness_summary: number
  alignment_interest_summary: number
  nine_box_summary: number[]
}

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