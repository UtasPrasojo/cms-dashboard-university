export interface MajorResponseSchema {
  data: MajorResponse
  message: string
  error: any
}

export interface MajorResponse {
  pagination: Pagination
  items: Major[]
}

export interface Pagination {
  page: number
  size: number
  total: number
}

export interface Major {
  id: string
  education_level: string
  major: string
  faculty: string
}

export interface MajorDetailRoot {
  data: Major
  message: string
  error: unknown
}

export interface CreateMajorPayload {
  name: string
  education_level: string
  faculty_id: string
}

export interface DeleteMajorPayload {
  name: string
}

export interface MajorFilter {
  page: number
  size: number
  total: number
  search: string
  sortBy: string
  orderBy: string
}

export interface GetMajorParams {
  page?: number
  size?: number
  search?: string
  sortBy?: string
  orderBy?: string
}

export interface MajorState {
  majors: Major[]
  allMajors: Major[]
  filter: MajorFilter
  loading: boolean
  error: string | null
}
