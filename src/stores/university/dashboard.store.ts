import { defineStore } from "pinia";
import { axiosWrapper } from "@/helpers/axios-wrapper";
import { validate } from "@/utils/validate";
import { referralCodeResponseSchema, type ReferralCode } from "@/stores/university/type/referral_code";
import { distributionStudentResponseSchema, type DistributionStudentData } from "@/stores/university/type/distribution_student"
import { percentageStatsResponseSchema, type PercentageStats } from "@/stores/university/type/percentage_stats"
import {cognitiveProfileResponseSchema, type CognitiveProfile} from "@/stores/university/type/cognitive_profile"
import  {archetypePersonalityResponseSchema, type ArchetypePersonality} from "@/stores/university/type/archetype_personality"
import { nineboxMatrixSchema, type NineBoxMatrixResponse } from "@/stores/university/type/ninebox_matrix"

const baseUrl = import.meta.env.VITE_BASE_URL as string;

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        referralCode: null as ReferralCode | null,
        distributionStudent: null as DistributionStudentData | null,
        distributionFilter: {
            page: 1,
            size: 10,
        },
        percentageStats: null as PercentageStats | null,
        cognitiveProfile: null as CognitiveProfile | null,
        archetypePersonality : null as ArchetypePersonality[] | null,
        nineboxMatrix: null as NineBoxMatrixResponse["data"] | null,
        error: null as string | null,
    }),

    getters: {
        distributionTotalPage: (state) => {
            const pagination = state.distributionStudent?.pagination
            if (!pagination || !pagination.size) return 1
            return Math.ceil(pagination.total / pagination.size)
        },
    },

    actions: {

        async getPercentageStats() {
            const res = await axiosWrapper.get(
                `${baseUrl}/admin-university/dashboard/percentage`
            );

            const result = validate(percentageStatsResponseSchema, res);
            if (!result.success) {
                console.error("Invalid percentage stats response:", result.errors);
                this.error = "Format data persentase tidak valid";
                return;
            }

            this.percentageStats = result.data.data;
        },
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
            const query = new URLSearchParams({
                page: String(this.distributionFilter.page),
                size: String(this.distributionFilter.size),
            })

            const res = await axiosWrapper.get(
                `${baseUrl}/admin-university/dashboard/student-major-distribution?${query.toString()}`
            );

            const result = validate(distributionStudentResponseSchema, res);
            if (!result.success) {
                console.error("Invalid distribution student response:", result.errors);
                this.error = "Format data distribusi mahasiswa tidak valid";
                return;
            }

            this.distributionStudent = result.data.data;
        },
        async getCognitiveProfile() {
            const res = await axiosWrapper.get(
                `${baseUrl}/admin-university/dashboard/cognitive-summary`
            );
            const result = validate(cognitiveProfileResponseSchema, res);
            if (!result.success) {
                console.error("Invalid cognitive profile response:", result.errors);
                this.error = "Format data profile kognitif tidak valid";
                return;
            }
            this.cognitiveProfile = result.data.data

        },
        async getArchetypePersonality(){
            const res = await axiosWrapper.get(
                `${baseUrl}/admin-university/dashboard/archetypes`
            );
            const result = validate(archetypePersonalityResponseSchema, res);
            if (!result.success) {
                console.error("Invalid archetype personality response:", result.errors);
                this.error = "Format data archetype personality tidak valid";
                return;
            }
            this.archetypePersonality = result.data.data
        },
        async getNineboxMatrix() {
            const res = await axiosWrapper.get(
                `${baseUrl}/admin-university/dashboard/ninebox-matrix`
            );

            const result = validate(nineboxMatrixSchema, res);
            if (!result.success) {
                console.error("Invalid ninebox matrix response:", result.errors);
                this.error = "Format data ninebox matrix tidak valid";
                return;
            }

            this.nineboxMatrix = result.data.data;
        },
    },
});