<template>
  <button @click="$emit('change', !checked)" class="flex gap-2 items-center text-sm" type="button" :disabled="disabled">
    <div class="flex-none flex items-center justify-center text-base-white w-5 h-5 border rounded-md"
      :class="[
        checked || indeterminate ? 'bg-primary-500 border-primary-500' : 
        disabled ? 'border-text-300 opacity-50 bg-gray-50 text-gray-100 ' : 'border-text-300 bg-base-white',
      ]">
      <i v-if="indeterminate" class="ri-subtract-line"></i>
      <i v-else class="ri-check-line"></i>
    </div>
    <slot/>
  </button>
</template>

<script setup>
/**
 * @type {{
 *   checked: boolean,
 *   indeterminate: boolean,
 *   disabled: boolean,
 * }}
 */
defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['change'])
</script>