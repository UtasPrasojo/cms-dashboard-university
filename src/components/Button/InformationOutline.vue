<template>
  <button
    class="button button-text"
    :class="buttonSize"
    :type="type"
    :disabled="disabled"
  >
    <div class="flex flex-row gap-1 items-center text-center justify-center">
      <slot />
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";

const button_size = {
  small: "px-4 py-2",
  medium: "px-4 py-3",
  large: "px-5 py-4",
};

/**
 * @type {{
 *   size: "small" | "medium" | "large",
 *   type: "button" | "submit" | "reset",
 *   disabled: boolean
 * }}
 */
const props = defineProps({
  size: {
    type: String,
    default: "medium",
    options: ["small", "medium", "large"],
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  type: {
    type: String,
    default: "button",
    options: ["button", "submit", "reset"],
    validator: (value) => ["button", "submit", "reset"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
    validator: (value) => [true, false].includes(value),
  },
});

const buttonSize = computed(() => {
  return `${button_size[props.size]}`;
});
</script>

<style scoped>
.button {
  @apply h-fit whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer bg-base-white border border-information-500 rounded-lg transition-colors;
}
.button:hover {
  @apply text-base-white bg-information-600;
}
.button:disabled {
  @apply cursor-auto border border-information-300 text-information-300;
}
.button-text {
  @apply font-semibold text-xs md:text-sm text-information-500;
}
</style>
