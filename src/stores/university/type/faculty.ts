export interface Root {
  data: Data
  message: string
  error: unknown
}

export interface Data {
  pagination: Pagination
  items: Item[]
}

export interface Pagination {
  page: number
  size: number
  total: number
}

export interface Item {
  faculty: string
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

export interface FacultyState {
  faculties: Item[]
  filter: FacultyFilter
  loading: boolean
  error: string | null
}