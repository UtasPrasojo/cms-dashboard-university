export interface StudentItem {
    id: string
    name: string
    email: string
    usi: string
    cohort: string
    education_level: string
    faculty: string
    major: string
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
}

export interface GetStudentParams {
    page?: number
    size?: number
    search?: string
    sortBy?: string
    orderBy?: string
}

export interface ManagementStudentState {
    students: StudentItem[]
    filter: StudentFilter
    loading: boolean
    error: string | null
}