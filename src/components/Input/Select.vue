<template>
  <div class="grid gap-1">
    <label v-if="label != null" :for="name" class="text-xs"> {{ label }}<span v-if="required"
        class="text-red-600">*</span> </label>
    <p class="mb-2 text-sm text-gray-700" v-if="description"> {{ description }} </p>

    <div class="relative">
      <i class="absolute text-text-500 right-3 translate-y-1/2 bottom-1/2 ri-arrow-down-s-line pointer-events-none"></i>
      <select :disabled="disabled" :required="required"
        class="appearance-none w-full  rounded-2xl border border-border-300 bg-transparent py-3 text-xs  px-5 focus:outline-primary-500 focus:bg-primary-50 bg-base-white"
        :class="{ 'pl-[35px]': icon != '' } + ' ' + customSelectClass" :name="name" :id="name" :placeholder="placeholder" v-model="value">

        <slot />
      </select>
    </div>
  </div>

</template>
<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    default: ""
  },
  selectClass: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: 'title'
  },
  description: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: 'title'
  },
  placeholder: {
    type: String,
    default: 'title'
  },
  icon: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'text'
  }
});
const emit = defineEmits(['update:modelValue'])

const customSelectClass = computed(() => {
  return `${props.selectClass}`
})
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
});
</script>