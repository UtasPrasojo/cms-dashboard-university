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
    <div
      v-if="disabled"
      class="input-text bg-gray-100 text-gray-500 cursor-not-allowed select-none flex items-center"
      :class="inputClass"
    >
      <span class="flex-1" :style="{ textAlign: align }">
        {{ modelValue ?? placeholder }}
      </span>
      <span class="text-gray-400 ml-2">%</span>
    </div>
    <div v-else class="relative flex items-center">
      <input
        :id="name"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        type="text"
        inputmode="numeric"
        class="input-text pr-8"
        :class="[inputClass, error ? 'input-error' : '']"
        :style="{ textAlign: align }"
        :value="modelValue"
        @input="handleInput"
        @invalid="error = true"
      />
      <span class="absolute right-3 text-sm text-text-400 pointer-events-none">%</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    default: 'percentage',
  },
  placeholder: {
    type: String,
    default: '0',
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
  max: {
    type: Number,
    default: 1000,
  },
  maxDecimals: {
    type: Number,
    default: 2,
  },
})

const emit = defineEmits(['update:modelValue'])

const error = ref(false)

const handleInput = (event) => {
  error.value = false
  let stripped = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
  if (props.maxDecimals != null && stripped.includes('.')) {
    const [int, dec] = stripped.split('.')
    stripped = `${int}.${dec.slice(0, props.maxDecimals)}`
  }
  let numeric = stripped === '' || stripped === '.' ? null : parseFloat(stripped)
  if (numeric != null && props.max != null && numeric > props.max) numeric = props.max
  emit('update:modelValue', numeric)
  event.target.value = numeric != null && stripped.endsWith('.') ? stripped : (numeric ?? '')
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
