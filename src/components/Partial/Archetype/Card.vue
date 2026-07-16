<template>
  <div class="relative rounded-3xl w-full max-w-[360px] aspect-[9/16] border-8 border-primary-300 overflow-clip object-center mx-auto">
    <!-- Background -->
    <img class="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover" :src="bgSrc" alt="">

    <!-- Layers -->
    <div class="absolute z-1 bg-base-dark/60 w-full h-full"></div>

    <!-- Corners -->
    <img class="absolute z-1 w-[15%] h-auto p-[1%] top-0 left-0 max-w-[40px]" src="@/assets/images/jpf/frame/corner.svg" alt="corner">
    <img class="absolute z-1 w-[15%] h-auto p-[1%] top-0 right-0 rotate-90 max-w-[40px]" src="@/assets/images/jpf/frame/corner.svg" alt="corner">
    <img class="absolute z-1 w-[15%] h-auto p-[1%] bottom-0 left-0 -rotate-90 max-w-[40px]" src="@/assets/images/jpf/frame/corner.svg" alt="corner">
    <img class="absolute z-1 w-[15%] h-auto p-[1%] bottom-0 right-0 rotate-180 max-w-[40px]" src="@/assets/images/jpf/frame/corner.svg" alt="corner">

    <!-- Center -->
    <img class="absolute z-1 top-[10%] left-1/2 transform -translate-x-1/2 w-[20%] h-auto max-w-[70px]" src="@/assets/images/jpf/frame/center.svg" alt="">

    <!-- Animal -->
    <img class="absolute z-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[clamp(80px,45%,150px)] aspect-square" :src="animalSrc" alt="">

    <!-- Borders (Tidak ada perubahan di sini) -->
    <div class="pointer-events-none absolute inset-0">
      <!-- Top horizontal border -->
      <div class="absolute h-[clamp(2px,0.5vw,3px)] bg-[repeating-linear-gradient(to_right,_#A855F7_0_3px,_transparent_2px_16px)]"
           :style="{'top': 'calc(var(--responsive-spacing-y) * 1)', 'left': 'calc(var(--responsive-spacing-x) * 1)', 'right': 'calc(var(--responsive-spacing-x) * 1)'}"></div>
      <!-- Bottom horizontal border -->
      <div class="absolute h-[clamp(2px,0.5vw,3px)] bg-[repeating-linear-gradient(to_right,_#A855F7_0_3px,_transparent_2px_16px)]"
           :style="{'bottom': 'calc(var(--responsive-spacing-y) * 1)', 'left': 'calc(var(--responsive-spacing-x) * 1)', 'right': 'calc(var(--responsive-spacing-x) * 1)'}"></div>
      <!-- Left vertical border -->
      <div class="absolute w-[clamp(2px,0.5vw,3px)] bg-[repeating-linear-gradient(to_bottom,_#A855F7_0_3px,_transparent_2px_16px)]"
           :style="{'left': 'calc(var(--responsive-spacing-x) * 0.5)', 'top': 'calc(var(--responsive-spacing-y) * 2)', 'bottom': 'calc(var(--responsive-spacing-y) * 2)'}"></div>
      <!-- Right vertical border -->
      <div class="absolute w-[clamp(2px,0.5vw,3px)] bg-[repeating-linear-gradient(to_bottom,_#A855F7_0_3px,_transparent_2px_16px)]"
           :style="{'right': 'calc(var(--responsive-spacing-x) * 0.5)', 'top': 'calc(var(--responsive-spacing-y) * 2)', 'bottom': 'calc(var(--responsive-spacing-y) * 2)'}"></div>
    </div>

    <!-- Text (MODIFIKASI DI SINI) -->
    <div class="absolute z-[5] bottom-[15%] left-1/2 transform -translate-x-1/2 w-[80%] text-center [container-type:inline-size]">
      <div class="p-[2.5%] rounded bg-primary-500 w-full">
        <!-- Mengubah nilai clamp untuk mencapai max 32px dan penyesuaian yang lebih halus -->
        <p class="text-base-white font-semibold text-[clamp(14px,9cqw,32px)] leading-none">
          {{ title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
* @type {{
*   title: string,
*   type: "owl" | "cheetah" | "ant" | "dolphin" | "lynx" | "fox" | "cow" | "wolf",
* }}
*/
const props = defineProps({
  type: {
    type: String,
    default: 'owl',
    required: true,
  },
  title: {
    type: String,
    default: 'Adaptive Innovator',
  }
})

/**
 * Ambil semua bg.png di: src/assets/images/jpf/<type>/bg.png
 */
const bgFiles = import.meta.glob('@/assets/images/jpf/*/bg.png', {
  eager: true,
  import: 'default',
})

/**
 * Ambil semua animal.svg di: src/assets/images/jpf/<type>/animal.svg
 */
const animalFiles = import.meta.glob('@/assets/images/jpf/*/animal.svg', {
  eager: true,
  import: 'default',
})

const buildMap = (files) => {
  return Object.fromEntries(
    Object.entries(files).map(([path, url]) => {
      // contoh path: "/src/assets/images/jpf/owl/bg.png"
      const parts = path.split('/')
      const folder = parts[parts.length - 2] // "owl"
      return [folder, url]
    }),
  )
}

const bgMap = buildMap(bgFiles)
const animalMap = buildMap(animalFiles)

// fallback kalau type yang diminta tidak ada
const fallbackKey = Object.keys(bgMap)[0] ?? null

const bgSrc = computed(() =>
  bgMap[props.type] ?? (fallbackKey ? bgMap[fallbackKey] : ''),
)

const animalSrc = computed(() =>
  animalMap[props.type] ?? (fallbackKey ? animalMap[fallbackKey] : ''),
)
</script>

<style scoped>
/* Definisikan custom properties untuk spacing responsif */
.relative.max-w-\[360px\] { /* Target the main container */
  --responsive-spacing-x: 14%; /* Example base percentage for horizontal spacing */
  --responsive-spacing-y: 4%; /* Example base percentage for vertical spacing */

  /* Anda bisa menyesuaikan ini dengan media query jika ingin kontrol lebih lanjut */
  /* @media (min-width: 768px) {
    --responsive-spacing-x: 8%;
    --responsive-spacing-y: 4%;
  } */
}
</style>