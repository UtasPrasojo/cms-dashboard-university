<template>
  <!-- breadcrumb -->
  <div class="relative top-0 left-0 w-full pt-1 pb-3">
    <div class="flex items-end justify-between w-full">
      <!-- left side -->
      <template v-if="back !== null">
        <button
          type="button"
          class="flex-none flex items-center font-semibold text-sm hover:text-primary-600 text-primary-500 h-full w-fit"
          @click="handleBackClick"
        >
          <i class="ri-arrow-left-line mr-1"></i>Kembali
        </button>
      </template>

      <!-- right side -->
      <div
        class="ml-auto flex-none flex gap-1 items-center text-sm text-text-500 font-semibold h-full"
      >
        <router-link
          to="/"
          class="flex gap-1 items-center hover:text-primary-600 text-primary-500"
        >
          <i class="leading-none align-middle fi fi-rr-apps-add"></i>
          <p>Beranda</p>
        </router-link>
        <p>/</p>
        <template v-for="(item, index) in data">
          <router-link
            :to="item.link"
            v-if="item.link"
            class="hover:text-primary-600 text-primary-500"
            >{{ item.name }}</router-link
          >
          <p v-else>{{ item.name }}</p>
          <p v-if="index != data.length - 1">/</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const authStore = useAuthStore();
const router = useRouter();

/**
 * @type {{
 *   data: [
 *      { name: String, link: String }
 *   ],
 *   back: String | Boolean | null
 * }}
 */
const props = defineProps({
  data: Array,
  back: {
    type: [Boolean, String],
    default: null,
  },
});

const handleBackClick = () => {
  const isFlutter =
    typeof window !== "undefined" &&
    window.flutter_inappwebview &&
    typeof window.flutter_inappwebview.callHandler === "function";


  if (isFlutter) {
    try {
      window.flutter_inappwebview.callHandler(
        "MyAssessmentRouteHandler",
      );
      return;
    } catch (err) {
      console.error("Flutter handler error:", err);
    }
  }


  if (typeof props.back === "string" && props.back.length > 0) {
    router.push(props.back);
  } else if (props.back === true) {
    router.go(-1);
  }
};
</script>
