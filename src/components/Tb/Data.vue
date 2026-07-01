<template>
  <td
    class="px-[16px] py-[14px] text-xs md:text-sm text-base-black"
    :class="alignText[align]"
    :colspan="colspanComputed"
    :rowspan="rowspanComputed"
  >
    <slot />
  </td>
</template>

<script setup>
import { computed } from 'vue'
const alignText = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}
const props = defineProps({
  align: { type: String, default: 'left' },
  colspan: { type: [String, Number], default: '' },
  rowspan: { type: [String, Number], default: '' }
})

const colspanComputed = computed(() => Number(props.colspan) || undefined)
const rowspanComputed = computed(() => Number(props.rowspan) || undefined)
</script>