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
    <div class="flex items-center gap-3">
      <slot name="left" />
      <InputDropdown variant="filter" class="min-w-[80px]" v-if="!hide_size" :label="null" name="size" id="size" :options="sizeList.map(size => ({ label: size == 1000000000 ? 'All' : size, value: size }))" @selected="res => updateSize(res)" placeholder="5" v-model="store[filterKey].size"/>
      <slot name="center" />
      <InputDropdownV2 class="min-w-[160px]" with_search v-if="with_division" :label="null" name="division" placeholder="Global" v-model="store[filterKey].division_id"/>
      <div v-if="searchable" class="relative focus-within:text-primary-500">
        <input
          @keyup="res => updateSearch(res)"
          :value="store[filterKey].search"
          @keydown.enter.prevent=""
          class="flex-grow appearance-none w-full lg:w-fit rounded-lg border border-border-300 bg-transparent py-2 text-xs md:text-sm text-base-black px-3 pr-6 focus:outline-primary-500 focus:bg-primary-50 bg-surface-primary"
          name="table-search"
          id="table-search"
          :placeholder="placeholder"
        />
        <i
          class="fi fi-rr-search absolute right-2 top-1/2 -translate-y-1/2 text-sm transition-colors pointer-events-none"
        ></i>
      </div>
      <slot/>
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
  if(props.with_division) {
    await authStore.fetchAllDivision()
  }
})

const sizeList = computed(() => {
  if(props.size_list) {
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
  if(newVal && newVal.total < newVal.last) {
    props.store[props.filterKey].page = 1
  }
}, { deep: true })
</script>