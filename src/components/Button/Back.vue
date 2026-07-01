<template>
  <button
    class="text-[10px] md:text-sm mb-3 flex flex-row gap-1 items-center"
    type="button"
    @click="handleBack()"
  >
    <i class="ri-arrow-left-line"></i>
    Kembali
  </button>
</template>
<script>
export default {
  props: {
    path: {
      type: String,
      default: null,
    },
  },
  methods: {
    handleBack() {
      if (this.path) this.$router.push(this.path);
      this.$router.back();
    },
  },
};
</script>
