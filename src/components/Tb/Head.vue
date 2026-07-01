<template>
  <th class="p-[16px] font-normal text-xs text-nowrap md:text-wrap md:text-sm" :class="`${alignText[align]}`" :colspan="colspanComputed" :rowspan="rowspanComputed">
    <button class="flex items-center" :class="marginButton[align]" type="button" @click="sortData()" v-if="sort">
      <slot/>
      <i v-if="store[filterKey].sortBy != sort" class="fi fi-rr-angles-up-down ml-2 opacity-50"></i>
      <template v-else>
        <i v-if="store[filterKey].orderBy == 'asc'" class="fi fi-rr-angle-small-up ml-2"></i>
        <i v-else-if="store[filterKey].orderBy == 'desc'" class="fi fi-rr-angle-small-down ml-2"></i>
      </template>
    </button>
    
    <p v-else>
      <slot/>
    </p>
    
  </th>
</template>

<script setup>
import { computed } from 'vue'
const alignText = {
  left: 'text-left items-start justify-start',
  center: 'text-center items-center justify-center',
  right: 'text-right items-end justify-end'
}

const marginButton = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto'
}

/**
 * @type {{
 *   store: object,
 *   align: "left" | "center" | "right",
 *   sort: string,
 *   filterKey: string
 * }}
 */
const props = defineProps({
  store: { type: Object, default: null },
  align: { type: String, default: 'left'},
  sort: { type: String, default: null },
  filterKey: { type: String, default: 'filter' },
  colspan: { type: [String, Number], default: '' },
  rowspan: { type: [String, Number], default: '' }
})

const colspanComputed = computed(() => Number(props.colspan) || undefined)
const rowspanComputed = computed(() => Number(props.rowspan) || undefined)

const sortData = () => {
  if (!props.store) return
  const filterObject = props.store[props.filterKey]
  if (!filterObject || typeof filterObject !== 'object') return
  
  // Check if we're switching to a different column
  const isSameColumn = filterObject.sortBy === props.sort
  
  // Set the new sortBy
  filterObject.sortBy = props.sort
  
  // If it's the same column, toggle between asc and desc
  if (isSameColumn) {
    if (filterObject.orderBy == 'desc') {
      filterObject.orderBy = 'asc'
    } else {
      filterObject.orderBy = 'desc'
    }
  } else {
    // If it's a different column, always start with 'asc'
    filterObject.orderBy = 'asc'
  }
}
</script>