<template>
  <div class="flex flex-row gap-2 items-center">
    <label 
      :for="computedId" 
      class="cursor-pointer select-none peer font-medium text-sm text-text-primary flex items-center gap-2"
      :class="{ 'opacity-50 cursor-not-allowed': disabled }"
    >
      <input 
        class="peer sr-only" 
        type="radio" 
        :name="name" 
        :id="computedId" 
        :value="value" 
        v-model="model" 
        :disabled="disabled"
      />

      <!-- Custom Radio -->
      <span class="radio-dot">
        <span class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full  bg-base-white scale-0 transition"></span>
      </span>

      <span>{{ label }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * @type {{
 *  id: [string, number],
 *  name: string,
 *  value: [boolean, string, number],
 *  label: string,
 *  disabled: boolean
 * }}
 */
const props = defineProps({
  id: { type: [String, Number], default: null },
  name: { type: String, required: true },
  value: { type: [Boolean, String, Number], required: true },
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false }
})

const model = defineModel()

const computedId = computed(() => {
  return props.id || `radio-${props.name}-${props.value}`
})
</script>

<style scoped>
.radio-dot {
  @apply block w-4 h-4 rounded-full border border-primary-500 bg-base-white relative peer-disabled:opacity-50 peer-checked:[&_span]:scale-100 peer-checked:[&_span]:bg-primary-500
}
</style>