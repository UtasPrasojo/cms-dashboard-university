export interface FacultyResponseScema {
  data: FacultyResponse
  message: string
  error: unknown
}

export interface FacultyResponse {
  pagination: Pagination
  items: Item[]
}

export interface Pagination {
  page: number
  size: number
  total: number
}

export interface Item {
  id: string
  name: string
  major_count: number
}

export interface Major {
  id: string
  name: string
}

export interface Faculty {
  id: string
  name: string
  majors: Major[]
}

export interface FacultyDetailRoot {
  data: Faculty
  message: string
  error: unknown
}

export interface FacultyFilter {
  page: number
  size: number
  total: number
  search: string
  sortBy: string
  orderBy: string
}

export interface GetFacultyParams {
  page?: number
  size?: number
  search?: string
  sortBy?: string
  orderBy?: string
}

export interface CreateFacultyPayload {
  name: string
}

export interface FacultyState {
  faculties: Item[]
  allFaculties: Item[]
  filter: FacultyFilter
  loading: boolean
  error: string | null
}