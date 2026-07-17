import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import type {
    ApprovalState,
    GetApprovalParams,
    ApprovalListResponse,
} from "@/stores/student/type/approval";

const baseUrl = import.meta.env.VITE_BASE_URL as string;

export const useApprovalStore = defineStore("approval", {
    state: (): ApprovalState => ({
        approvals: [],
        filter: {
            page: 1,
            size: 10,
            total: 0,
            search: "",
            sortBy: "",
            orderBy: "",
        },
        loading: false,
        error: null,
    }),

    getters: {
        totalPage: (state) => (state.filter.size > 0 ? Math.ceil(state.filter.total / state.filter.size) : 0),
        pageIndex: (state) => {
            const { page, size, total } = state.filter
            return {
                first: total === 0 ? 0 : (page - 1) * size + 1,
                last: Math.min(page * size, total),
                total,
            }
        },
    },

    actions: {
        async getApprovals(params: GetApprovalParams = {}): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const query: Record<string, string> = {};

                if (params.page != null) query.page = String(params.page);
                if (params.size != null) query.size = String(params.size);
                if (params.search) query.search = params.search;
                if (params.sortBy) query.sortBy = params.sortBy;
                if (params.orderBy) query.orderBy = params.orderBy;

                const queryString = Object.entries(query)
                    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                    .join("&");

                const url = queryString
                    ? `${baseUrl}/admin-university/student/approvals?${queryString}`
                    : `${baseUrl}/admin-university/student/approvals`;

                const res: ApprovalListResponse = await axiosWrapper.get(url);

                if (res.status.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data approval";
                    return;
                }

                this.approvals = res.data.items;
                this.filter.total = res.data.pagination.total;
                this.filter.page = res.data.pagination.page;
                this.filter.size = res.data.pagination.size;
            } catch (error) {
                console.error("Failed to fetch approvals:", error);
                this.error = "Terjadi kesalahan saat mengambil data approval";
            } finally {
                this.loading = false;
            }
        },
    },
});
