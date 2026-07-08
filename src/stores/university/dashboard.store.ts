import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import type { ReferralCodeResponse, ReferralCode } from "@/stores/university/type/referral_code";
import type { DistributionStudentResponse, DistributionStudent } from "@/stores/university/type/distribution_student"

const baseUrl = import.meta.env.VITE_BASE_URL as string;

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        referralCode: null as ReferralCode | null,
        distributionStudent: null as DistributionStudent | null
    }),

    actions: {
        async getReferralCode() {
            const res = await axiosWrapper.get<ReferralCodeResponse>(
                `${baseUrl}/admin-university/dashboard/referral`
            );

            this.referralCode = res.data;
        },
        async getDistributionStudent() {
            const res = await axiosWrapper.get<DistributionStudentResponse>(
                `${baseUrl}/admin-university/dashboard/student-major-distribution`
            );
            this.distributionStudent = res.data

        },
    },
});