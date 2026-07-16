<template>
  <img
    v-if="!disabled"
    :src="imageSrc"
    :alt="label"
  />
</template>

<script setup>
import { computed } from "vue";

/**
 * @type {{
 *   variant: "owl" | "cheetah" | "ant" | "dolphin" | "lynx" | "fox" | "cow" | "wolf",
 *   color: boolean,
 *   label: string,
 *   disabled: boolean,
 * }}
 */
const props = defineProps({
  variant: { type: String, default: "owl", required: true },
  color: { type: Boolean, default: true },
  label: { type: String, default: "?" },
  disabled: { type: Boolean, default: false },
});

const buildImageMap = (files) => {
  const map = {};
  Object.entries(files).forEach(([path, url]) => {
    const parts = path.split("/");
    const folder = parts[parts.length - 2]; // "<variant>"
    map[folder] = url;
  });
  return map;
};

const imageFilesColor = import.meta.glob("@/assets/images/jpf/*/animal.png", {
  eager: true,
  import: "default",
});

const imageFilesWhite = import.meta.glob("@/assets/images/jpf/*/animal_white.png", {
  eager: true,
  import: "default",
});

const imageMapColor = buildImageMap(imageFilesColor);
const imageMapWhite = buildImageMap(imageFilesWhite);

const imageSrc = computed(() => {
  const variant = props.variant;

  // color === false -> white
  const activeMap = props.color ? imageMapColor : imageMapWhite;

  if (activeMap[variant]) return activeMap[variant];

  // fallback to first available
  const firstVariant = Object.keys(activeMap)[0];
  return firstVariant ? activeMap[firstVariant] : "";
});
</script>