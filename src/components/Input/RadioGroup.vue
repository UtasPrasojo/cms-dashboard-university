<template>
  <div class="grid gap-1 content-start">
    <label v-if="label != null" :for="name" class="text-xs md:text-sm text-text-500 font-medium"> {{ label }}<span v-if="required"
        class="text-red-600">*</span> </label>
    <p class="mb-2 text-xs text-gray-700" v-if="description"> {{ description }} </p>
    <div class="relative" :class="{ 'flex gap-2': flex, 'flex-col gap-2': flexCol }">
      <InputRadio
        v-for="option in values"
        v-model="value"
        :label="option?.name ?? option"
        :name="name"
        :disabled="disabled || option.disabled"
        :value="option?.value ?? option"
        :id="`${name}-${option?.name ?? option}`"
      />
    </div>
  </div>

</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    default: ""
  },
  flexCol: {
    default: false
  },
  classOption: {
    default: ''
  },
  flex: {
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'text'
  },
  description: {
    type: String,
    default: null
  },
  values: {
    type: Array,
    default: []
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
});
</script>