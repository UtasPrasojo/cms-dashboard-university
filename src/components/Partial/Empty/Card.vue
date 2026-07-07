<template>
  <div
    class="w-full p-6 bg-border-100 flex flex-col gap-2 items-center justify-center rounded-lg"
  >
    <img
      src="@/assets/illustration-no-data-cuate.svg"
      alt=""
      :class="sizeImage[size]"
    />
    <p class="text-sm font-bold text-text-500">
      {{ title }}
    </p>
    <p class="text-sm text-text-secondary font-medium">
      {{ desc }}
    </p>
  </div>
</template>
<script setup>
/**
 * @type {{
 *  title: string,
 *  desc: string,
 *  size: "sm" | "md" | "lg"
 * }}
 */
defineProps({
  title: {
    type: String,
    default: "Hasil kosong",
  },
  desc: {
    type: String,
    default: "Hasil masih belum tersedia.",
  },
  size: {
    type: String,
    default: "md",
  },
});
// data
const sizeImage = {
  sm: "w-[180px]",
  md: "w-[300px]",
  lg: "w-[420px]",
};
</script>
<style></style>
