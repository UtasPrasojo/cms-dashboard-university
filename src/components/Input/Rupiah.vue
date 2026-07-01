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
    <div class="relative">
      <div
        v-if="disabled"
        class="input-text bg-gray-100 text-gray-500 cursor-not-allowed select-none"
        :class="[inputClass, suffix ? 'pr-12' : '']"
        :style="{ textAlign: align }"
      >
        {{ formattedValue || placeholder }}
      </div>
      <input
        v-else
        :id="name"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        type="text"
        class="input-text"
        :class="[inputClass, error ? 'input-error' : '', suffix ? 'pr-12' : '']"
        :style="{ textAlign: align }"
        :value="formattedValue"
        @input="handleInput"
        @invalid="error = true"
      />
      <span
        v-if="suffix"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-secondary pointer-events-none select-none"
      >
        {{ suffix }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

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
    default: 'rupiah',
  },
  placeholder: {
    type: String,
    default: 'Dalam Rp.',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right', 'center'].includes(value),
  },
  suffix: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const error = ref(false)

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const formattedValue = computed(() => {
  return props.modelValue == null ? '' : formatter.format(props.modelValue)
})

const MAX_SAFE_DIGITS = 12

const handleInput = (event) => {
  error.value = false
  const el = event.target
  const prevValue = el.value
  const prevCursor = el.selectionStart ?? prevValue.length

  const stripped = prevValue.replace(/[^0-9]/g, '')

  // Jika melebihi batas digit, revert ke value sebelumnya
  if (stripped.length > MAX_SAFE_DIGITS) {
    const reverted = props.modelValue == null ? '' : formatter.format(props.modelValue)
    el.value = reverted
    const cursorPos = Math.min(prevCursor - 1, reverted.length)
    el.setSelectionRange(cursorPos, cursorPos)
    return
  }

  const numeric = stripped === '' ? null : parseInt(stripped, 10)
  emit('update:modelValue', numeric)

  const formatted = numeric == null ? '' : formatter.format(numeric)
  el.value = formatted

  // Hitung posisi cursor berdasarkan jumlah digit sebelum cursor
  const digitsBeforeCursor = prevValue.slice(0, prevCursor).replace(/[^0-9]/g, '').length
  let digitCount = 0
  let newCursor = formatted.length
  for (let i = 0; i < formatted.length; i++) {
    if (/[0-9]/.test(formatted[i])) {
      digitCount++
      if (digitCount === digitsBeforeCursor) {
        newCursor = i + 1
        break
      }
    }
  }
  if (digitsBeforeCursor === 0) {
    newCursor = formatted.indexOf(formatted.match(/[0-9]/)?.[0] ?? '')
    if (newCursor < 0) newCursor = formatted.length
  }
  el.setSelectionRange(newCursor, newCursor)
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
