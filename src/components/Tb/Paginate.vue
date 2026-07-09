<template>
  <div v-if="filter.total_page !== 0" class="mt-auto" :class="helperStore.onFetch ? 'opacity-50 pointer-events-none' : ''">
    <hr v-if="hr" class="my-6">

    <div class="flex w-full mt-3 justify-between md:items-center">
      <p class="hidden md:block font-normal text-sm">
        <span class="text-base-black">Menampilkan {{ filter.page_index?.first }} sampai {{ filter.page_index?.last }}</span>&nbsp;
        <span class="text-base-black">dari {{ filter.page_index?.total }} keseluruhan</span>
      </p>

      <div class="flex gap-2 w-fit font-semibold text-sm text-base-black">

        <!-- prev -->
        <button
          type="button"
          @click="filter.page--"
          :disabled="filter.page <= 1"
          class="flex items-center justify-center w-9 h-9 opacity-80 hover:opacity-100 bg-base-section rounded-xl disabled:opacity-40 border border-border-300"
        >
          <i class="fi fi-br-angle-small-left"></i>
        </button>

        <!-- PAGE 1 -->
        <button
          type="button"
          @click="filter.page = 1"
          :class="btnClass(1)"
          class="flex items-center justify-center w-9 h-9 rounded-xl border border-border-300"
        >
          1
        </button>

        <!-- Ellipsis left -->
        <button type="button" disabled v-if="filter.page > 3" class="flex items-center justify-center w-9 h-9 rounded-xl border border-border-300">…</button>

        <!-- Middle pages: page-1, page, page+1 -->
        <template v-for="p in middlePages" :key="p">
          <button
            v-if="p !== 1 && p !== filter.total_page"
            type="button"
            @click="filter.page = p"
            :class="btnClass(p)"
            class="flex items-center justify-center w-9 h-9 rounded-xl border border-border-300"
          >
            {{ p }}
          </button>
        </template>

        <!-- Ellipsis right -->
        <button type="button" disabled v-if="filter.page < filter.total_page - 2" class="flex items-center justify-center w-9 h-9 rounded-xl border border-border-300">…</button>

        <!-- LAST PAGE -->
        <button
          v-if="filter.total_page > 1"
          type="button"
          @click="filter.page = filter.total_page"
          :class="btnClass(filter.total_page)"
          class="flex items-center justify-center w-9 h-9 rounded-xl border border-border-300"
        >
          {{ filter.total_page }}
        </button>

        <!-- next -->
        <button
          type="button"
          @click="filter.page++"
          :disabled="filter.page >= filter.total_page"
          class="flex items-center justify-center w-9 h-9 opacity-80 hover:opacity-100 bg-primary-500 rounded-xl disabled:opacity-40"
        >
          <i class="fi fi-br-angle-small-right text-base-white"></i>
        </button>

      </div>
    </div>
  </div>

  <div class="md:px-12" v-else-if="!helperStore.onFetch && filter.total_page == 0">
    <PartialEmptyState :title="empty_title" :desc="empty_desc">
      <slot name="button" />
    </PartialEmptyState>
  </div>
</template>

<script setup>
import { useHelperStore } from '@/stores/helper.store';
import { computed } from 'vue';

const helperStore = useHelperStore();

const props = defineProps({
  filter: Object,
  empty_title: String,
  empty_desc: String,
  hr: Boolean,
});

// generate pages around current page
const middlePages = computed(() => {
  const cur = props.filter.page;
  const total = props.filter.total_page;

  const pages = [];

  for (let p = cur - 1; p <= cur + 1; p++) {
    if (p > 1 && p < total) pages.push(p);
  }

  return pages;
});

// class for active vs normal button
const btnClass = (p) =>
  props.filter.page === p
    ? 'bg-base-dark/90 text-base-white'
    : 'bg-[#F9FBFE] opacity-80 hover:opacity-100';

</script>