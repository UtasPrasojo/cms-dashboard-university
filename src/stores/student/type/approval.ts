export interface ApprovalItem {
    id: string
    name: string
    email: string
    usi: string
    faculty: string
    major: string
    education_level: string
    submitted_at: string
}

export interface Pagination {
    page: number
    size: number
    total: number
}

export interface ApprovalListData {
    pagination: Pagination
    items: ApprovalItem[]
}

export interface ApprovalListResponse {
    status: number
    data: ApprovalListData
    message: string
    error: string | null
}

export interface ApprovalFilter {
    page: number
    size: number
    total: number
    search: string
    sortBy: string
    orderBy: string
}

export interface GetApprovalParams {
    page?: number
    size?: number
    search?: string
    sortBy?: string
    orderBy?: string
}

export interface ApprovalState {
    approvals: ApprovalItem[]
    filter: ApprovalFilter
    loading: boolean
    error: string | null
}
