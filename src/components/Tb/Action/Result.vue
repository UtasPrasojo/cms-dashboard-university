<template>
  <button title="Result" type="button" class="button-action">
    <i class="ri-file-text-line text-xs"></i> Result
  </button>
</template>

<style scoped>
.button-action {
  @apply flex flex-row items-center gap-1 p-2 text-left font-medium text-sm bg-base-white w-full text-primary-500 rounded-lg
}

.button-action:disabled {
  @apply text-primary-300 bg-primary-100
}

.button-action:hover {
  @apply text-base-white bg-primary-500
}
</style>