import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import type {
    ManagementStudentState,
    GetStudentParams,
    StudentListResponse,
    CreateStudentPayload,
} from "@/stores/student/type/management_student";

const baseUrl = import.meta.env.VITE_BASE_URL as string;

function extractErrorMessage(error: unknown, fallback: string): string {
    const res = error as { data?: { message?: string; errors?: { message: string }[] } } | undefined;
    return res?.data?.errors?.map((item) => item.message).join(", ")
        || res?.data?.message
        || fallback;
}

export const useManagementStore = defineStore("management_student", {
    state: (): ManagementStudentState => ({
        students: [],
        filter: {
            page: 1,
            size: 10,
            total: 0,
            search: "",
            sortBy: "",
            orderBy: "",
            facultyIds: [],
            majorIds: [],
            nineBoxPositions: [],
            archetypes: [],
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
        async getStudent(params: GetStudentParams = {}): Promise<void> {
            this.loading = true;
            this.error = null;

            try {
                const query: Record<string, string> = {};

                if (params.page != null) query.page = String(params.page);
                if (params.size != null) query.size = String(params.size);
                if (params.search) query.search = params.search;
                if (params.sortBy) query.sortBy = params.sortBy;
                if (params.orderBy) query.orderBy = params.orderBy;
                if (params.facultyIds?.length) query.faculty_id = params.facultyIds.join(",");
                if (params.majorIds?.length) query.major_id = params.majorIds.join(",");
                if (params.nineBoxPositions?.length) query.nine_box_position = params.nineBoxPositions.join(",");
                if (params.archetypes?.length) query.archetype = params.archetypes.join(",");

                const queryString = new URLSearchParams(query).toString();
                const url = queryString
                    ? `${baseUrl}/admin-university/student?${queryString}`
                    : `${baseUrl}/admin-university/student`;

                const res: StudentListResponse = await axiosWrapper.get(url);

                if (res.status.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengambil data student";
                    return;
                }

                this.students = res.data.items;
                this.filter.total = res.data.pagination.total;
                this.filter.page = res.data.pagination.page;
                this.filter.size = res.data.pagination.size;
            } catch (error) {
                console.error("Failed to fetch students:", error);
                this.error = "Terjadi kesalahan saat mengambil data student";
            } finally {
                this.loading = false;
            }
        },

        async createStudent(payload: CreateStudentPayload): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/student`;
                const res: StudentListResponse = await axiosWrapper.post(url, payload);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal menambahkan mahasiswa";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to create student:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat menambahkan mahasiswa");
                return false;
            } finally {
                this.loading = false;
            }
        },

        async importStudents(file: File): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const formData = new FormData();
                formData.append("file", file);

                const url = `${baseUrl}/admin-university/student/import`;
                const res: StudentListResponse = await axiosWrapper.post(url, formData);

                if ((res as unknown as { status: number }).status?.toString()[0] !== "2") {
                    this.error = res.message || "Gagal mengimpor data mahasiswa";
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Failed to import students:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengimpor data mahasiswa");
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});