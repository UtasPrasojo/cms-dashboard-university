import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import { validate } from "@/utils/validate";
import { importStudentResponseSchema, csvTemplateResponseSchema } from "@/stores/student/type/management_student";
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

                const queryParts = Object.entries(query).map(
                    ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
                );

                // Multi-select filters: each value is encoded individually, but joined
                // with a literal "," (not "%2C") since the backend expects a plain
                // comma-separated list, e.g. faculty_ids=abc,def or ninebox_matrix=2:2,0:1.
                const pushListParam = (key: string, values?: string[]) => {
                    if (!values?.length) return;
                    queryParts.push(`${key}=${values.map((value) => encodeURIComponent(value)).join(",")}`);
                };

                pushListParam("faculty_ids", params.facultyIds);
                pushListParam("major_ids", params.majorIds);
                pushListParam("archetype", params.archetypes);

                // ninebox_matrix values are "row:col" pairs — encodeURIComponent would
                // turn ":" into "%3A", so this one is appended fully unencoded.
                if (params.nineBoxPositions?.length) {
                    queryParts.push(`ninebox_matrix=${params.nineBoxPositions.join(",")}`);
                }

                const queryString = queryParts.join("&");
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

                const url = `${baseUrl}/admin-university/student/csv-import`;
                const res = await axiosWrapper.post(url, formData);

                const result = validate(importStudentResponseSchema, res);
                if (!result.success) {
                    console.error("Invalid import student response:", result.errors);
                    this.error = "Format respons import mahasiswa tidak valid";
                    return false;
                }

                if (result.data.status.toString()[0] !== "2") {
                    this.error = result.data.message || "Gagal mengimpor data mahasiswa";
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

        async downloadCsvTemplate(): Promise<boolean> {
            this.loading = true;
            this.error = null;

            try {
                const url = `${baseUrl}/admin-university/student/csv-template`;
                const res = await axiosWrapper.get(url);

                const result = validate(csvTemplateResponseSchema, res);
                if (!result.success) {
                    console.error("Invalid csv template response:", result.errors, res);
                    this.error = "Format respons template tidak valid";
                    return false;
                }

                const csv = typeof result.data === "string" ? result.data : result.data.data;

                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const objectUrl = URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = objectUrl;
                link.download = "template-mahasiswa.csv";
                document.body.appendChild(link);
                link.click();
                link.remove();
                URL.revokeObjectURL(objectUrl);

                return true;
            } catch (error) {
                console.error("Failed to download csv template:", error);
                this.error = extractErrorMessage(error, "Terjadi kesalahan saat mengunduh template");
                return false;
            } finally {
                this.loading = false;
            }
        },
    },
});