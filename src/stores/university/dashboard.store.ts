import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import { validate } from "@/utils/validate";
import { referralCodeResponseSchema, type ReferralCode } from "@/stores/university/type/referral_code";
import { distributionStudentResponseSchema, type DistributionStudent } from "@/stores/university/type/distribution_student"

const baseUrl = import.meta.env.VITE_BASE_URL as string;

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        referralCode: null as ReferralCode | null,
        distributionStudent: null as DistributionStudent | null,
        error: null as string | null,
    }),

    actions: {
        async getReferralCode() {
            const res = await axiosWrapper.get(
                `${baseUrl}/admin-university/dashboard/referral`
            );

            const result = validate(referralCodeResponseSchema, res);
            if (!result.success) {
                console.error("Invalid referral code response:", result.errors);
                this.error = "Format data referral tidak valid";
                return;
            }

            this.referralCode = result.data.data;
        },
        async getDistributionStudent() {
            const res = await axiosWrapper.get(
                `${baseUrl}/admin-university/dashboard/student-major-distribution`
            );

            const result = validate(distributionStudentResponseSchema, res);
            if (!result.success) {
                console.error("Invalid distribution student response:", result.errors);
                this.error = "Format data distribusi mahasiswa tidak valid";
                return;
            }

            this.distributionStudent = result.data.data;
        },
    },
});