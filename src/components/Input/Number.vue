<template>
  <div class="relative grid items-center  text-xs">
    <button type="button" @click="$emit('update:modelValue', modelValue > -365 ? modelValue - 1 : modelValue)" class="left-2 button-action"> 
      <i class="ri-subtract-line"></i> 
    </button>
    <input type="number" :min="-365" :max="365" class="input-number"
      :value="modelValue" @input="updateValue($event)" 
      onkeypress=""
    >
    <button type="button" @click="$emit('update:modelValue', modelValue < 365 ? modelValue + 1 : modelValue)" class="right-2 button-action"> 
      <i class="ri-add-line"></i> 
    </button>
  </div>
</template>
<script>

export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  methods: {
    updateValue(event) {
      let value = Number(event.target.value);
      if (value < -365) event.target.value = -365
      if (value > 365) event.target.value = 365
      if ((event.charCode >= 48 && event.charCode <= 57) || event.charCode === 45) {
        return;
      }
      this.$emit('update:modelValue', Number(event.target.value));
    }
  }
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
}

input[type=number] {
    -moz-appearance:textfield; /* Firefox */
}
.input-number {
  @apply w-full text-center px-4 py-3 rounded-2xl  outline-primary-500 border focus:bg-primary-50
}
.button-action {
  @apply absolute w-6 h-6 hover:bg-primary-50 rounded-full flex-none;
}
</style>