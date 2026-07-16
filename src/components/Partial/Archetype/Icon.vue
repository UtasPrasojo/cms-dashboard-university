<template>
  <img v-if="!disabled" :class="sizeList[size]" :src="imageSrc" :alt="label" />
  <PartialBadgeBasic v-else type="primary" label="?" />
</template>

<script setup>
import { computed } from "vue";
import Ant from "@/assets/images/archetype/3d/ant.svg";
import Cow from "@/assets/images/archetype/3d/cow.svg";
import Dog from "@/assets/images/archetype/3d/dog.svg";
import Dolphin from "@/assets/images/archetype/3d/dolphin.svg";
import Cat from "@/assets/images/archetype/3d/cat.svg";
import Owl from "@/assets/images/archetype/3d/owl.svg";
import Tiger from "@/assets/images/archetype/3d/tiger.svg";
import Wolf from "@/assets/images/archetype/3d/wolf.svg";

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
  size: {type: String, default: 'medium'},
  disabled: { type: Boolean, default: false },
});

const sizeList = {
  small: "w-4 h-4",
  medium: "w-[22px] h-[22px]"
}

// API archetype codes: wolf, cow, dolphin, ant, lynx, cheetah, fox, owl.
// Only 8 3D assets exist under assets/images/archetype/3d; lynx/cheetah/fox
// reuse the closest existing asset until dedicated art ships (same fallback
// used in ArchetypePersonality.vue).
const imageByCode = {
  wolf: Wolf,
  cow: Cow,
  dolphin: Dolphin,
  ant: Ant,
  owl: Owl,
  lynx: Cat,
  cheetah: Tiger,
  fox: Dog,
};

const imageSrc = computed(() => imageByCode[props.variant] ?? Ant);
</script>
