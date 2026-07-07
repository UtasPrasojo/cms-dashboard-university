<template>
  <div class="fixed bottom-6 right-6 z-[9999]">
    <BaseToast
      :show="toastStore.show"
      :type="toastStore.type"
      :title="toastStore.title"
      :message="toastStore.message"
      @close="toastStore.hide()"
    />
  </div>
</template>

<script setup lang="ts">
import BaseToast from '@/components/Alert/BaseToast.vue'
import { useToastStore } from '@/stores/toast.store'

const toastStore = useToastStore()
</script>
