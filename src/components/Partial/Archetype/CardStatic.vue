<template>
  <img
  class="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
  :src="imageSrc"
  :alt="title"
  draggable="false"
  />
</template>

<script setup>
import { computed } from "vue";
import emptyImage from "@/assets/images/jpf/empty.png";

/**
 * @type {{
 *   type: "company" | "school",
 *   title: string,
 *   variant: "owl" | "cheetah" | "ant" | "dolphin" | "lynx" | "fox" | "cow" | "wolf",
 *   disabled: boolean,
 * }}
 */
const props = defineProps({
  type: {
    type: String,
    default: "company",
  },
  variant: {
    type: String,
    default: "owl",
  },
  title: {
    type: String,
    default: "Adaptive Innovator",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const imageFiles = import.meta.glob("@/assets/images/jpf/*/*.png", {
  eager: true,
  import: "default",
});

const buildImageMap = (files) => {
  const map = {};

  Object.entries(files).forEach(([path, url]) => {
    const parts = path.split("/");
    const fileName = parts[parts.length - 1];
    const folder = parts[parts.length - 2];

    const variant = folder;
    const type = fileName.replace(/\.\w+$/, ""); // "company" | "school"

    if (!map[variant]) map[variant] = {};
    map[variant][type] = url;
  });

  return map;
};

const imageMap = buildImageMap(imageFiles);

const imageSrc = computed(() => {
  if (props.disabled) {
    return emptyImage;
  }

  const variant = props.variant;
  const type = props.type == 'school' ? 'school' : 'company';

  if (imageMap[variant]?.[type]) {
    return imageMap[variant]?.[type];
  }

  return emptyImage;
});
</script>
