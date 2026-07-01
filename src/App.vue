<template>
  <div id="app">
    <component :is="layout">
      <RouterView :key="route.fullPath" />
    </component>
  </div>
  <Alert />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import Alert from '@/components/Alert/index.vue'

const route = useRoute()
const layout = computed(() => route.meta.layout ?? DefaultLayout)
</script>