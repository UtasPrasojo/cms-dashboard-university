<template>
  <ButtonDangerOutline size="small" v-if="is_active" @click="is_show = true">
    <slot />
  </ButtonDangerOutline>
  <ButtonSuccessOutline size="small" v-else @click="is_show = true">
    <slot />
  </ButtonSuccessOutline>

  <!-- modal -->
  <PartialModalConfirm
    v-model="is_show"
    :title="title"
    :variant="is_active ? 'error' : 'success'"
    :confirm="buttonConfirm"
    @onConfirmed="submit"
  >
    <p class="text-sm">{{ desc }}</p>
  </PartialModalConfirm>
</template>

<script setup>
import { ref } from "vue";

/**
 * @type {{
 *   title: string,
 *   desc: string,
 *   buttonConfirm: string,
 *   is_active: boolean
 * }}
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
  buttonConfirm: {
    type: String,
    default: "",
  },
  is_active: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["onConfirmed"]);
const is_show = ref(false);

const submit = () => {
  emit("onConfirmed");
  is_show.value = false;
};
</script>
