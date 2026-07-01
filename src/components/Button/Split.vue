<template>
  <div class="group relative gap-3">
    <button
      class="button button-text group-hover:bg-primary-600 flex flex-row items-center justify-center"
      :type="type"
      :disabled="disabled"
    >
      <div class="flex flex-row gap-1 items-center text-center justify-center" :class="buttonSize">
        {{ label }}
      </div>
      <span class="text-center bg-primary-700 group-hover:bg-primary-900 transition-colors h-full" :class="[iconSize, {'!bg-base-section': disabled}]">
        <i class="fi fi-rr-angle-small-down block leading-[0] text-[14px]" aria-hidden="true"></i>
      </span>
    </button>
    <div v-if="!disabled" class="hidden z-10 group-hover:block absolute min-w-[200px] w-fit right-0 bg-base-white top-full p-2 shadow-md rounded-xl">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const button_size = {
  small: "pl-4 pr-2 py-2",
  medium: "pl-4 pr-2 py-3",
  large: "pl-4 pr-2 py-4",
};

const icon_size = {
  small: "px-[5px] py-2.5",
  medium: "px-[5px] py-3.5",
  large: "px-2 py-4",
}

/**
 * @type {{
 *   size: "small" | "medium" | "large",
 *   type: "button" | "submit" | "reset",
 *   disabled: boolean
 * }}
 */
const props = defineProps({
  label: {
    type: String,
    default: "Button",
  },
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

const iconSize = computed(()=>{
  return `${icon_size[props.size]}`
})
</script>

<style scoped>
.button {
  @apply h-fit whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer bg-primary-500 border border-transparent rounded-lg transition-colors;
}
.button:disabled {
  @apply cursor-auto bg-base-section;
}
.button-text {
  @apply font-semibold text-xs md:text-sm text-base-white;
}
</style>
