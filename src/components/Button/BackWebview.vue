<template>
  <div
    class="w-full bg-primary-700 px-4 pt-5 pb-3 flex items-center gap-3 shadow-md"
  >
    <!-- Back Button -->
    <button @click="goBack" class="flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="#f4f4f4"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 12h14M5 12l6 6m-6-6l6-6"
        />
      </svg>
    </button>

    <!-- Title -->
    <h1 class="text-white text-[16px] font-semibold truncate">
      {{ title }}
    </h1>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    default: "Hasil Asesmen",
  },
  disableBack: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

const goBack = () => {
  const isFlutter =
    typeof window !== "undefined" &&
    window.flutter_inappwebview &&
    typeof window.flutter_inappwebview.callHandler === "function";

  if (isFlutter) {
    try {
      window.flutter_inappwebview.callHandler("MyAssessmentRouteHandler");
      return;
    } catch (err) {
      console.error("Flutter handler error:", err);
    }
  }

  router.back();
};
</script>
