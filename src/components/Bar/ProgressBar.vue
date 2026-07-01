<template>
  <div class="flex items-center gap-1 w-full">
    <div
      class="h-3 rounded-full transition-all duration-300"
      :class="colorClass"
      :style="{ width: progressPercentage + '%' }"
    ></div>

    <div
      class="h-3 rounded-full transition-all duration-300"
      :class="trackClass"
      :style="{ width: remainingPercentage + '%' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type ProgressColor = "success" | "warning" | "danger";

interface Props {
  value: number;
  max?: number;
  color?: ProgressColor;
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  color: "success",
});

const progressPercentage = computed(() => {
  if (!props.max) return 0;
  const percent = Math.round((props.value / props.max) * 100);
  return Math.min(100, Math.max(0, percent));
});

const remainingPercentage = computed(() => {
  return 100 - progressPercentage.value;
});

const colorMap: Record<ProgressColor, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-400",
  danger: "bg-red-500",
};

const colorClass = computed(() => colorMap[props.color]);

// track dengan pola garis diagonal (seperti pada gambar)
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