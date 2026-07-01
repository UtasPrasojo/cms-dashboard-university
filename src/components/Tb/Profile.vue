<template>
  <TbData
    class="bg-base-white sticky left-0 z-[9] align-top after:absolute after:top-0 after:right-0 after:h-full after:w-px after:bg-border-300"
  >
    <div class="flex flex-row gap-2 items-center relative">
      <div
        :class="{
          'opacity-100 scale-100': statusTooltip,
          'opacity-0 scale-90 pointer-events-none': !statusTooltip,
        }"
        class="transition-all ease-in-out duration-150 z-[1] absolute w-fit -translate-x-full -translate-y-full rounded-lg rounded-br-none bg-base-dark/50 py-1 px-2"
      >
        <p class="text-base-white font-Regular text-Body-5">
          Gagal memuat gambar
        </p>
      </div>

      <!-- Image container -->
      <div
        v-if="imageUrl && !imageError"
        class="h-8 w-8 shrink-0 rounded-full border border-primary-200 overflow-hidden flex items-center justify-center"
      >
        <img
          :key="imageUrl"
          :src="imageUrl"
          @error="handleImageError"
          class="h-full w-full object-cover"
          alt=""
          loading="lazy"
        />
      </div>

      <!-- Error state -->
      <div
        v-else-if="imageUrl && imageError"
        @mouseover="statusTooltip = true"
        @mouseleave="statusTooltip = false"
        class="relative h-8 w-8 shrink-0 rounded-full bg-base-white border border-primary-200 overflow-hidden flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          fill="none"
        >
          <path
            d="M18.25 0.75H1.75C1.35218 0.75 0.970644 0.908035 0.68934 1.18934C0.408035 1.47064 0.25 1.85218 0.25 2.25V15.75C0.25 16.1478 0.408035 16.5294 0.68934 16.8107C0.970644 17.092 1.35218 17.25 1.75 17.25H7.75C7.90742 17.25 8.06085 17.2005 8.18856 17.1085C8.31627 17.0164 8.41178 16.8865 8.46156 16.7372L9.85188 12.5672L13.2812 11.1966C13.3754 11.1585 13.461 11.1019 13.5329 11.03C13.6047 10.9582 13.6613 10.8726 13.6994 10.7784L15.07 7.35187L19.24 5.96156C19.3888 5.9113 19.5181 5.81558 19.6096 5.68791C19.7011 5.56025 19.7502 5.40707 19.75 5.25V2.25C19.75 1.85218 19.592 1.47064 19.3107 1.18934C19.0294 0.908035 18.6478 0.75 18.25 0.75ZM8.53844 11.7628L7.20906 15.75H1.75V13.125L6.625 8.25L9.47688 11.1019L8.96875 11.3034C8.86802 11.3443 8.77737 11.4065 8.70307 11.4858C8.62877 11.5651 8.5726 11.6596 8.53844 11.7628ZM18.25 4.70906L14.2628 6.03844C14.1594 6.0729 14.0647 6.1295 13.9853 6.20431C13.906 6.27911 13.8439 6.37031 13.8034 6.47156L12.4234 9.92344L10.9919 10.5L7.68531 7.19344C7.40404 6.91235 7.02265 6.75445 6.625 6.75445C6.22735 6.75445 5.84596 6.91235 5.56469 7.19344L1.75 11.0034V2.25H18.25V4.70906ZM19.4387 7.80281C19.3423 7.73328 19.2307 7.68767 19.1132 7.66974C18.9957 7.65181 18.8756 7.66207 18.7628 7.69969L16.5316 8.44406C16.4282 8.47842 16.3336 8.53488 16.2542 8.60952C16.1749 8.68416 16.1128 8.77518 16.0722 8.87625L14.7306 12.2297L11.3772 13.5712C11.2761 13.6118 11.1851 13.674 11.1105 13.7533C11.0358 13.8326 10.9794 13.9273 10.945 14.0306L10.2006 16.2619C10.1629 16.3747 10.1525 16.4948 10.1703 16.6125C10.1881 16.7301 10.2337 16.8417 10.3032 16.9383C10.3727 17.0348 10.4642 17.1134 10.5701 17.1676C10.676 17.2218 10.7932 17.2501 10.9122 17.25H18.25C18.6478 17.25 19.0294 17.092 19.3107 16.8107C19.592 16.5294 19.75 16.1478 19.75 15.75V8.41219C19.75 8.29337 19.7218 8.17624 19.6677 8.07046C19.6136 7.96467 19.5351 7.87232 19.4387 7.80281ZM18.25 15.75H11.9528L12.2575 14.8359L15.5866 13.5047C15.6808 13.4666 15.7663 13.41 15.8382 13.3382C15.91 13.2663 15.9666 13.1808 16.0047 13.0866L17.3359 9.7575L18.25 9.45281V15.75Z"
            fill="#C2B1EA"
          />
        </svg>
      </div>

      <!-- No image / initial state -->
      <div
        v-else
        class="h-8 w-8 shrink-0 rounded-full bg-primary-500 overflow-hidden flex items-center justify-center"
      >
        <p class="font-semibold text-sm text-base-white">
          {{ $initial(name) }}
        </p>
      </div>

      <div class="min-w-0">
        <p class="text-xs md:text-sm font-bold text-base-black truncate">
          {{ name ?? "-" }}
        </p>
        <p v-if="subtitle" class="text-xs text-base-grey truncate">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </TbData>
</template>

<script setup>
import { ref, watch } from "vue";

const alignText = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const props = defineProps({
  imageUrl: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    default: null,
  },
  subtitle: {
    type: String,
    default: null,
  },
  align: {
    type: String,
    default: "left",
  },
});

const imageError = ref(false);
const statusTooltip = ref(false);

watch(
  () => props.imageUrl,
  () => {
    imageError.value = false;
  },
  { immediate: true },
);

const handleImageError = () => {
  imageError.value = true;
};
</script>
