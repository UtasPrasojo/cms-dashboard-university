<template>
  <!-- button -->
  <button title="Hapus" :type="type" class="button-action">
    <i :class="[props.icon]"></i>
    <span>Hapus</span>
  </button>

  <!-- modal -->
  <!-- <template>
    <teleport to="#app">
      <div class="grid justify-items-center content-center fixed top-0 left-0 z-50 w-screen h-screen bg-base-black/40 p-5"
        @click.self="is_show = false" v-if="is_show">
        <div class="rounded-lg max-w-[400px] px-5 py-7 bg-base-white text-left text-black">
          <p class="font-bold text-sm">{{ title ?? "Hapus Jadwal?" }}</p>
          <hr class="my-3" />
          <p class="text-sm mb-7"><span v-html="desc"></span></p>
          <div class="flex gap-3 w-full">
            <ButtonBlackOutline @click="is_show = false" class="flex-1">
              Batalkan
            </ButtonBlackOutline>
            <ButtonDanger @click="submit()" class="flex-1">Ya, Hapus</ButtonDanger>
          </div>
        </div>
      </div>
    </teleport>
  </template> -->
</template>

<script setup>
import { ref } from "vue";

/**
 * @type {{
  title: String,
  desc: String,
  type: String,
  icon: String
 }}
 */
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    default:
      "Apakah anda yakin ingin menghapus Jadwal ini?, aksi anda ini tidak dapat dibatalkan.",
  },
  type: {
    type: String,
    default: "button",
  },
  icon: {
    type: String,
    default: "ri-delete-bin-line",
  },
});

const emit = defineEmits(["onConfirmed"]);
const is_show = ref(false);

const submit = () => {
  emit("onConfirmed");
  is_show.value = false;
};
</script>

<style scoped>
.button-action {
  @apply flex flex-row items-center gap-1 p-2 text-left font-medium text-sm bg-base-white w-full text-primary-500 rounded-lg
}

.button-action:disabled {
  @apply text-primary-300 bg-primary-100
}

.button-action:hover {
  @apply text-base-white bg-primary-500
}
</style>