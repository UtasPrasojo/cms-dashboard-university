<template>
  <ButtonWhite class="w-fit" :disabled="isExporting">
    <IconLoading class="animate-spin" v-if="isExporting" />
    <i class="ri-file-list-3-line" v-else></i>
    <slot />
  </ButtonWhite>
</template>

<script>
export default {
  props: {
    isExporting: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
