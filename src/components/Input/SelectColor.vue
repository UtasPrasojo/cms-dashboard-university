<template>
    <label class="inline-block cursor-pointer">
      <input 
        type="radio" 
        :value="value" 
        :checked="modelValue === value" 
        @change="$emit('update:modelValue', value)" 
        class="hidden" 
      />
      <div 
        :style="{
          backgroundColor: modelValue === value ? 'white' : value,
          borderColor: modelValue === value ? value : '#ccc'
        }"
        class="w-[50px] h-[50px] rounded-[12px] border-2 flex items-center justify-center"
      >
        <div class="w-[40px] h-[40px] rounded-[12px]" :style="{backgroundColor: value}"></div>
      </div>
    </label>
  </template>
  
  <script>
  export default {
    props: {
      value: {
        type: String,
        required: true
      },
      modelValue: {
        type: String,
        required: true
      }
    }
  }
  </script>
  