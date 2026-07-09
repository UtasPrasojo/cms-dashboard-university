<template>
  <div class="flex flex-col items-center gap-2 w-10">
    <div class="flex flex-col-reverse items-center gap-1 h-40 w-10">
      <div
        class="w-full rounded-2xl transition-all duration-300 flex items-center justify-center pt-1"
        :class="[barClass, valueTextClass]"
        :style="{ height: progressPercentage + '%' }"
      >
        <span class="text-[10px] font-semibold leading-none">
          {{ value }}
        </span>
      </div>
      <div
        class="w-full rounded-2xl transition-all duration-300"
        :class="trackClass"
        :style="{ height: remainingPercentage + '%' }"
      ></div>
    </div>

    <span
      class="text-xs text-center whitespace-pre-line"
      :class="active ? 'text-primary-900 font-semibold' : 'text-gray-500'"
    >{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  label?: string;
  value: number;
  max?: number;
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  value: 0,
  max: 100,
  active: false,
});

const progressPercentage = computed(() => {
  if (!props.max) return 0;
  const percent = Math.round((props.value / props.max) * 100);
  return Math.min(100, Math.max(0, percent));
});

const remainingPercentage = computed(() => {
  return 100 - progressPercentage.value;
});

const barClass = computed(() =>
  props.active ? "bg-primary-500" : "bg-primary-200"
);

// bg-primary-200 (bar non-aktif) -> teks gelap (text-primary-900) agar kontras
// bg-primary-500 (bar aktif) -> teks putih agar kontras
const valueTextClass = computed(() =>
  props.active ? "text-white" : "text-primary-900"
);

// track dengan pola garis diagonal
const trackClass = computed(() => "bg-stripe-track");
</script>

<style scoped>
.bg-stripe-track {
  background-color: #f1f1f1;
  background-image: repeating-linear-gradient(
    45deg,
    #e5e5e5 0,
    #e5e5e5 1px,
    transparent 1px,
    transparent 6px
  );
}
</style>