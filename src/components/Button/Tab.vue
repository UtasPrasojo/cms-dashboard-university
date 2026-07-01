<template>
  <div class="flex w-full mb-4">
    <button
      v-for="tab in menu"
      @click="tabEvent(tab.value)"
      :key="tab.value"
      class="switch"
      :class="(modelValue == tab.value || route.query.tab == tab.value) ? 'switch-on' : 'switch-off'"
    >
      {{ tab.label }}
      <PartialBadgeBasic v-if="tab?.count" :label="tab.count" />
    </button>
    <div class="w-full border-b-2 border-[#F0F3FF]"></div>
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

onMounted(() => {
  if (!props.modelValue && !props.menu.map(tab => tab.value).includes(route.query.tab)) {
    router.push(`?tab=${props.menu[0]?.value}`)
  }
})

</script>

<style scoped>
.switch {
  @apply flex-none px-3 py-2.5 text-xs md:text-sm
}
.switch-on {
  @apply flex gap-1 items-center font-bold text-text-primary border-b-2 border-primary-500;
}
.switch-off {
  @apply flex gap-1 items-center font-medium text-text-400 border-b border-border-200 hover:bg-gray-50;
}
</style>
