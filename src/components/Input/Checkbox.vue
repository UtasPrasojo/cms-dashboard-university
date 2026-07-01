<template>
  <button type="button" class="w-5 h-5 flex-none flex justify-center items-center rounded-md text-base-white border border-border-300" :class="value ? 'bg-primary-500 border-primary-500':'bg-base-white'" @click="updateValue()">
    <i class="ri-check-line "></i>
  </button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['value'])
const emits = defineEmits(['update'])
const filled = ref(false)

const updateValue = (() => {
  filled.value = !filled.value
  emits('update', props.value)
})


</script>