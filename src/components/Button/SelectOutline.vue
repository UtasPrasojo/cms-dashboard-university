<template>
  <div class="relative  inline-block">
    <!-- Button utama -->
    <button
      class="button button-text w-[186px]"
      :class="buttonSize"
      :disabled="disabled"
      @click="toggleDropdown"
      type="button"
    >
      <div class="flex flex-row gap-1  items-center justify-center">
        <slot name="label">{{ selectedLabel }}</slot>
      </div>
    </button>

    <!-- Dropdown -->
    <ul
      v-if="isOpen"
      class="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50"
    >
      <li
        v-for="(option, index) in options"
        :key="index"
        @click="selectOption(option)"
        class="px-4 py-2 cursor-pointer hover:bg-primary-100"
      >
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

/**
 * Props:
 * - options: array dari parent [{ value: any, label: string }]
 * - size, disabled: sama seperti button primary
 */
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  size: {
    type: String,
    default: "medium",
    validator: (value) => ["small", "medium", "large"].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Number, Object],
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const button_size = {
  small: "px-4 py-2",
  medium: "px-4 py-3",
  large: "px-5 py-4",
};

const buttonSize = computed(() => button_size[props.size]);

const isOpen = ref(false);
const selectedLabel = ref("Select");

watch(
  () => props.modelValue,
  (val) => {
    const found = props.options.find((o) => o.value === val);
    selectedLabel.value = found ? found.label : "Select";
  },
  { immediate: true }
);

function toggleDropdown() {
  if (!props.disabled) isOpen.value = !isOpen.value;
}

function selectOption(option) {
  selectedLabel.value = option.label;
  emit("update:modelValue", option.value);
  isOpen.value = false;
}

// Klik di luar untuk menutup dropdown
function handleClickOutside(event) {
  if (!event.target.closest(".relative.inline-block")) {
    isOpen.value = false;
  }
}

window.addEventListener("click", handleClickOutside);
</script>

<style scoped>
.button {
  @apply h-fit whitespace-nowrap text-ellipsis overflow-hidden cursor-pointer bg-base-white border border-primary-500 rounded-lg transition-colors;
}
.button:hover {
  @apply text-base-white bg-primary-600;
}
.button:disabled {
  @apply cursor-auto opacity-50 text-primary-500 bg-base-white;
}
.button-text {
  @apply font-semibold text-xs md:text-sm text-primary-500;
}
</style>
