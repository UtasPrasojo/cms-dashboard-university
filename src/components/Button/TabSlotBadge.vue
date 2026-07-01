<template>
  <div class="flex w-full mb-4 ">
    <button
      v-for="tab in menu"
      :key="tab.value"
      @click="$emit('update:modelValue', tab.value)"
      class="switch relative flex items-center gap-2"
      :class="modelValue === tab.value ? 'switch-on' : 'switch-off'"
    >
      <span>{{ tab.label }}</span>

      <slot name="badge" :tab="tab" />
    </button>
    <div class="w-full border-b-2 border-[#F0F3FF]"></div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  menu: {
    type: Array,
    required: true,
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.switch {
  @apply flex-none px-3 py-2.5 text-xs md:text-sm relative;
}
.switch-on {
  @apply font-bold text-base-dark border-b-2 border-primary-500;
}
.switch-off {
  @apply font-medium text-text-300 border-b border-border-200 hover:bg-gray-50;
}
</style>
