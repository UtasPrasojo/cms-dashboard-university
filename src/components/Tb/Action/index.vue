<template>
  <button :disabled="disabled" type="button" class="button-action">
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.button-action {
  @apply flex flex-row gap-1 p-2 text-left font-medium text-sm bg-base-white w-full text-primary-500 rounded-lg;
}

.button-action:disabled {
  @apply text-primary-300 bg-transparent hover:bg-transparent hover:text-primary-300;
}

.button-action:hover {
  @apply text-base-white bg-primary-500;
}
</style>
