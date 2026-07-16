import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import type {
    MajorState,
    MajorResponseSchema,
    GetMajorParams,
    Major,
    MajorDetailRoot,
    CreateMajorPayload,
    DeleteMajorPayload,
} from "@/stores/university/type/major";

const baseUrl = import.meta.env.VITE_BASE_URL as string;

function extractErrorMessage(error: unknown, fallback: string): string {
    const res = error as { data?: { message?: string; errors?: { message: string }[] } } | undefined;
    return res?.data?.errors?.map((item) => item.message).join(", ")
        || res?.data?.message
        || fallback;
}

export const useMajorstore = defineStore("major", {
    state: (): MajorState => ({
        majors: [],
        allMajors: [],
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
        totalPage: (state) =>
            state.filter.size > 0 ? Math.ceil(state.filter.total / state.filter.size) : 0,
        pageIndex: (state) => {
            const { page, size, total } = state.filter;
            return {
                first: total === 0 ? 0 : (page - 1) * size + 1,
                last: Math.min(page * size, total),
                total,
            };
        },
    },
    actions: {

        async getMajors(params: GetMajorParams = {}): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const query: Record<string, string> = {};

                if (params.page != null) query.page = String(params.page);
                if (params.size != null) query.size = String(params.size);
                if (params.search) query.search = params.search;
                if (params.sortBy) query.sortBy = params.sortBy;
                if (params.orderBy) query.orderBy = params.orderBy;

                const queryString = new URLSearchParams(query).toString();
                const url = queryString
                    ? `${baseUrl}/admin-university/master/majors?${queryString}`
                    : `${baseUrl}/admin-university/master/majors`;

                const res: MajorResponseSchema = await axiosWrapper.get(url);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data program studi";
                    return;
                }

                this.majors = res.data.items;
                this.filter.total = res.data.pagination.total;
            } catch (error) {
                console.error("Failed to fetch majors:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengambil data program studi");
            } finally {
                this.loading = false;
            }
        },
        async getAllMajors(): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/majors?page=1&size=50`;
                const res: MajorResponseSchema = await axiosWrapper.get(url);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data program studi";
                    return;
                }

                this.allMajors = res.data.items;
            } catch (error) {
                console.error("Failed to fetch all majors:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengambil data program studi");
            } finally {
                this.loading = false;
            }
        },
        async getMajorById(majorId: number | string): Promise<Major | null> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/majors/${majorId}`;
                const res: MajorDetailRoot = await axiosWrapper.get(url);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data program studi";
                    return null;
                }

                return res.data;
            } catch (error) {
                console.error("Failed to fetch major:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengambil data program studi");
                return null;
            } finally {
                this.loading = false;
            }
        },

        async createMajor(payload: CreateMajorPayload): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/majors`;
                const res: MajorResponseSchema = await axiosWrapper.post(url, payload);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal menambahkan program studi";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to create major:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat menambahkan program studi");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async updateMajor(majorId: number | string, payload: CreateMajorPayload): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/majors/${majorId}`;
                const res: MajorResponseSchema = await axiosWrapper.patch(url, payload);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal memperbarui program studi";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to update major:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat memperbarui program studi");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async deleteMajor(majorId: number | string, payload: DeleteMajorPayload): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/majors/${majorId}`;
                const res: MajorResponseSchema = await axiosWrapper.delete(url, payload);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal menghapus program studi";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to delete major:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat menghapus program studi");
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});
