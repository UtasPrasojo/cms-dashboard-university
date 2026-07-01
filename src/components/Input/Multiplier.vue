<template>
  <div :class="['grid', label ? 'gap-1' : '']">
    <label
      v-if="label != null"
      :for="name"
      class="text-xs md:text-sm text-text-500 font-medium"
      :class="labelClass"
    >
      {{ label }}<span v-if="required" class="text-error-600">*</span>
    </label>
    <input
      :id="name"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      type="text"
      class="input-text"
      :class="[inputClass, error ? 'input-error' : '']"
      :value="formattedValue"
      @input="handleInput"
      @blur="handleBlur"
      @invalid="error = true"
    />
  </div>
</template>

<script setup>

import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  labelClass: {
    type: String,
    default: '',
  },
  inputClass: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'multiplier',
  },
  placeholder: {
    type: String,
    default: 'x 2.00',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
})

const emit = defineEmits(['update:modelValue'])
const error = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    if (val == null) return
    if (val > props.max) emit('update:modelValue', props.max)
    else if (val < props.min) emit('update:modelValue', props.min)
  },
  { immediate: true },
)

const formattedValue = computed(() => {
  return props.modelValue == null ? '' : 'x ' + props.modelValue
})

const handleInput = (event) => {
  if (props.disabled) return
  
  error.value = false
  const input = event.target
  const prevLen = input.value.length
  const prevCursor = input.selectionStart

  // Strip everything except digits and decimal point
  const stripped = input.value.replace(/[^0-9.]/g, '')
  // Keep only the first decimal point
  const dotIndex = stripped.indexOf('.')
  let cleaned =
    dotIndex === -1
      ? stripped
      : stripped.slice(0, dotIndex + 1) + stripped.slice(dotIndex + 1).replace(/\./g, '')
  // Remove leading zeros (keep "0" and "0.xx")
  if (cleaned.length > 1 && cleaned[0] === '0' && cleaned[1] !== '.') {
    cleaned = cleaned.replace(/^0+/, '') || '0'
  }
  // Limit to 2 decimal places
  const cleanedDotIndex = cleaned.indexOf('.')
  if (cleanedDotIndex !== -1 && cleaned.length - cleanedDotIndex - 1 > 2) {
    cleaned = cleaned.slice(0, cleanedDotIndex + 3)
  }
  if (cleaned !== '' && cleaned !== '.') {
    const num = parseFloat(cleaned)
    if (num > props.max) {
      cleaned = String(props.max)
    } else if (num < props.min) {
      cleaned = String(props.min)
    }
  }
  const parsed = cleaned === '' || cleaned === '.' ? null : parseFloat(cleaned)
  const numeric = parsed === 0 ? null : parsed
  emit('update:modelValue', numeric)

  const newValue = cleaned === '' ? '' : 'x ' + cleaned
  input.value = newValue
  // Restore cursor position relative to the change in length
  const diff = newValue.length - prevLen
  const cursor = Math.max(0, Math.min(prevCursor + diff, newValue.length))
  input.setSelectionRange(cursor, cursor)
}

const handleBlur = (event) => {
  // Clear display if value is 0 or just a dot (not a valid multiplier)
  if (props.modelValue == null) {
    event.target.value = ''
  }
}
</script>

<style scoped>
.input-text {
  @apply w-full rounded-lg border bg-surface-primary border-border-400 py-2 px-3 text-sm appearance-none;
}
.input-text:focus {
  @apply outline-primary-500 bg-primary-100;
}
.input-text:disabled {
  @apply bg-gray-100 text-gray-500;
}
.input-error {
  @apply border-red-500 bg-red-50/50;
}
</style>
