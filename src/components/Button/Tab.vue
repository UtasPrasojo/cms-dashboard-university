<template>
  <div class="inline-flex items-center gap-2 w-fit rounded-full  p-1.5 ">
    <button
      v-for="tab in menu"
      @click="tabEvent(tab.value)"
      :key="tab.value"
      type="button"
      class="switch"
      :class="isActive(tab.value) ? 'switch-on' : 'switch-off'"
    >
      {{ tab.label }}
      <span
        v-if="tab?.count"
        class="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs font-semibold"
        :class="isActive(tab.value) ? 'bg-base-white text-primary-500' : 'bg-base-section text-text-400'"
      >
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

/**
 * @type {{
 *   modelValue: string,
 *   menu: [{
 *     label: string,
 *     value: string
 * }]
 }}
 */

const route = useRoute()
const router = useRouter()

const props =defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  menu: {
    type: Array,
    default: () => [],
    required: true,
  },
})
const emits = defineEmits(["update:modelValue"])

const tabEvent = (value) => {
  emits("update:modelValue", value)
  if (!props.modelValue) {
    router.push(`?tab=${value}`)
  }
}

const isActive = (value) => props.modelValue == value || route.query.tab == value

onMounted(() => {
  if (!props.modelValue && !props.menu.map(tab => tab.value).includes(route.query.tab)) {
    router.push(`?tab=${props.menu[0]?.value}`)
  }
})

</script>

<style scoped>
.switch {
  @apply flex-none flex gap-2 items-center px-5 py-2.5 text-xs md:text-sm rounded-full transition-colors
}
.switch-on {
  @apply font-semibold text-base-white bg-primary-500;
}
.switch-off {
  @apply font-medium text-text-400 bg-base-white hover:bg-base-section;
}
</style>
