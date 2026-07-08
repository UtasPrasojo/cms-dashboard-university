<template>
  <div class="h-screen w-full flex  p-[0.5] overflow-hidden bg-[#F0F3FF]">
    <LayoutNavbar />

    <main
      ref="mainRef"
      class="flex-1 min-w-0 overflow-auto relative"
      @scroll="handleScroll"
    >
      <div
        class="sticky top-0 z-20 px-[0.5] pt-1 pb-3 transition-transform duration-300 ease-in-out"
        :class="isTopbarHidden ? '-translate-y-[110%]' : 'translate-y-0'"
      >
        <LayoutTopbar />
      </div>

      <div class="-mt-[72px] pt-[72px] bg-[#F0F3FF]">
        <div
          class="absolute top-4 left-0 w-[300px] h-[300px] rounded-full bg-primary-500 opacity-30 blur-3xl"
        ></div>
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mainRef = ref<HTMLElement | null>(null)
const isTopbarHidden = ref(false)
const lastScrollTop = ref(0)
const SCROLL_THRESHOLD = 10 

function handleScroll(): void {
  const el = mainRef.value
  if (!el) return

  const currentScrollTop = el.scrollTop
  const diff = currentScrollTop - lastScrollTop.value
  if (currentScrollTop <= 0) {
    isTopbarHidden.value = false
    lastScrollTop.value = currentScrollTop
    return
  }

  if (Math.abs(diff) < SCROLL_THRESHOLD) return

  if (diff > 0) {
    isTopbarHidden.value = true
  } else {
    isTopbarHidden.value = false
  }

  lastScrollTop.value = currentScrollTop
}
</script>