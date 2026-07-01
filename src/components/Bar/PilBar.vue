<template>
  <div class="flex flex-col-reverse items-center gap-1 h-full w-10">
    <div
      class="w-full rounded-2xl bg-primary-500 transition-all duration-300"
      :style="{ height: progressPercentage + '%' }"
    ></div>
    <div
      class="w-full rounded-2xl transition-all duration-300"
      :class="trackClass"
      :style="{ height: remainingPercentage + '%' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  value: number;
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
});

const progressPercentage = computed(() => {
  if (!props.max) return 0;
  const percent = Math.round((props.value / props.max) * 100);
  return Math.min(100, Math.max(0, percent));
});

const remainingPercentage = computed(() => {
  return 100 - progressPercentage.value;
});

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
