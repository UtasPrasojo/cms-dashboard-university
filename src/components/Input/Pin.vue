<template>
  <div :class="['grid', label ? 'gap-1': '']">
    <label v-if="label != null" :for="name" class="text-xs md:text-sm text-text-500 font-medium" :class="customLabelClass"> 
      {{ label }}<span v-if="required" class="text-error-600">*</span> 
    </label>

    <pin-input class="flex gap-2 w-full"
      input-class="appearance-none rounded-lg border bg-surface-primary border-border-400 py-2 text-sm text-center focus:outline-primary-500 focus:bg-primary-50"
      v-model="modelValue"
      :length="6"
      :autofocus="autofocus"
      @completed=""
    />
    <div>

    </div>
    <p class="font-bold leading-none text-[9px] text-primary-500" v-if="description"> {{ description ?? '' }} </p>
  </div>
</template>

<script setup>
defineProps({
  name: String,
  label: String,
  required: Boolean,
  customLabelClass: String,
  description: String,
  icon: String,
  autofocus: { type: Boolean, default: true }
})

const modelValue = defineModel()
</script>


<style scoped>

</style>
