<template>
  <div class="flex flex-col gap-2 sm:flex-row md:justify-between content-center md:items-center mb-3">
    <div class="flex flex-row gap-2 items-center justify-center">
      <div class="flex flex-col">
        <!-- <p class="container-title"> {{ title }} </p> -->
        <p class="font-bold text-md md:text-lg text-base-black"> {{ title }} </p>
        <p v-if="desc" class="container-desc"> {{ desc ?? '' }} </p>
      </div>
      <slot name="title-right" />
      <PartialBadgeBasic v-if="badge !== false && badge !== null && badge !== undefined" :label='`${badge ?? "0"}`' />
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <slot name="left" />
      <InputDropdown variant="filter" class="min-w-[80px]" v-if="!hide_size" :label="null" name="size" id="size"
        :options="sizeList.map(size => ({ label: size == 1000000000 ? 'All' : size, value: size }))"
        @selected="res => updateSize(res)" placeholder="5" v-model="store[filterKey].size" />
      <slot name="center" />
      <InputDropdownV2 class="min-w-[160px]" with_search v-if="with_division" :label="null" name="division"
        placeholder="Global" v-model="store[filterKey].division_id" />
      <div v-if="searchable"
        class="flex items-center gap-2 rounded-3xl border border-border-300 bg-surface-primary px-3 py-2 focus-within:border-primary-500 focus-within:bg-primary-50 flex-1 min-w-[160px] sm:flex-initial sm:w-[220px]">
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-base-dark shrink-0">
          <i class="fi fi-rr-search flex items-center justify-center text-white text-xs leading-none"></i>
        </div>

        <input @keyup="res => updateSearch(res)" :value="store[filterKey].search" @keydown.enter.prevent=""
          class="w-full min-w-0 bg-transparent text-xs md:text-sm text-base-black placeholder:text-text-400 focus:outline-none"
          name="table-search" id="table-search" :placeholder="placeholder" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'
import { computed, onMounted, watch, ref } from 'vue';

/**
 * @type {{
  store: Object,
  title: String,
  desc: String,
  size_list: Array,
  hide_size: Boolean,
  badge: Boolean,
  searchable: Boolean | default true,
  with_division: Boolean,
  placeholder: String
 }}
 */
const props = defineProps({
  store: { type: Object, default: null },
  title: { type: String, default: null },
  desc: { type: String, default: null },
  size_list: { type: Array, default: null },
  hide_size: { type: Boolean, default: false },
  badge: { type: [Boolean, String, Number], default: false },
  searchable: { type: Boolean, default: true },
  with_division: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Cari di sini' },
  filterKey: { type: String, default: 'filter' }
})

const authStore = useAuthStore()
const timeout = ref(false)

onMounted(async () => {
  if (props.with_division) {
    await authStore.fetchAllDivision()
  }
})

const sizeList = computed(() => {
  if (props.size_list) {
    return props.size_list
  } else {
    return [5, 10, 15, 20, 50, 100]
  }
})

const updateSearch = ((res) => {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    props.store[props.filterKey].page = 1
    props.store[props.filterKey].search = res.target.value
  }, 800);
})

const updateSize = ((res) => {
  props.store[props.filterKey].page = 1
})

watch(() => props.store?.[props.filterKey]?.page_index, (newVal) => {
  if (newVal && newVal.total < newVal.last) {
    props.store[props.filterKey].page = 1
  }
}, { deep: true })
</script>