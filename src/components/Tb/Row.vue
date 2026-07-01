<template>
  <tr :class="typeClass">
    <slot />
  </tr>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: "data",
  },
});

const listType = {
  data: "bg-[#F9FBFE] hover:bg-primary-50 [&>td:first-child]:rounded-l-2xl [&>td:last-child]:rounded-r-2xl",
  static: "bg-base-white",
  head: "bg-base-dark/90 text-base-white font-normal [&>th:first-child]:rounded-l-2xl [&>th:last-child]:rounded-r-2xl",
};

const typeClass = computed(() => {
  return listType[props.type];
});
</script>