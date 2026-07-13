import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import type {
    CreateFacultyPayload,
    Faculty,
    FacultyDetailRoot,
    FacultyState,
    GetFacultyParams,
    FacultyResponseScema,
} from "@/stores/university/type/faculty";

const baseUrl = import.meta.env.VITE_BASE_URL as string;

function extractErrorMessage(error: unknown, fallback: string): string {
    const res = error as { data?: { message?: string; errors?: { message: string }[] } } | undefined;
    return res?.data?.errors?.map((item) => item.message).join(", ")
        || res?.data?.message
        || fallback;
}

export const useFacultystore = defineStore("faculty", {
    state: (): FacultyState => ({
        faculties: [],
        allFaculties: [],
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
        async getFaculty(params: GetFacultyParams = {}): Promise<void> {
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
                    ? `${baseUrl}/admin-university/master/faculties?${queryString}`
                    : `${baseUrl}/admin-university/master/faculties`;

                const res: FacultyResponseScema = await axiosWrapper.get(url);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data faculty";
                    return;
                }

                this.faculties = res.data.items;
                this.filter.total = res.data.pagination.total;
            } catch (error) {
                console.error("Failed to fetch faculties:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengambil data faculty");
            } finally {
                this.loading = false;
            }
        },

        async getAllFaculties(): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/faculties?page=1&size=100`;
                const res: FacultyResponseScema = await axiosWrapper.get(url);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data faculty";
                    return;
                }

                this.allFaculties = res.data.items;
            } catch (error) {
                console.error("Failed to fetch all faculties:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengambil data faculty");
            } finally {
                this.loading = false;
            }
        },
        async getFacultyById(facultyId: number | string): Promise<Faculty | null> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/faculties/${facultyId}`;
                const res: FacultyDetailRoot = await axiosWrapper.get(url);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data faculty";
                    return null;
                }

                return res.data;
            } catch (error) {
                console.error("Failed to fetch faculty:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengambil data faculty");
                return null;
            } finally {
                this.loading = false;
            }
        },

        async createFaculty(payload: CreateFacultyPayload): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/faculties`;
                const res: FacultyResponseScema = await axiosWrapper.post(url, payload);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal menambahkan faculty";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to create faculty:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat menambahkan faculty");
                return false;
            } finally {
                this.loading = false;
            }
        },
        async updateFaculty(facultyId: number | string, payload: CreateFacultyPayload): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/faculties/${facultyId}`;
                const res: FacultyResponseScema = await axiosWrapper.put(url, payload);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal memperbarui faculty";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to update faculty:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat memperbarui faculty");
                return false;
            } finally {
                this.loading = false;
            }
        },
        async deleteFaculty(facultyId: number | string, payload: CreateFacultyPayload): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/master/faculties/${facultyId}`;
                const res: FacultyResponseScema = await axiosWrapper.delete(url, payload);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal menghapus faculty";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to delete faculty:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat menghapus faculty");
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});