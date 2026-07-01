<template>
  <div class="w-full custom-shadow rounded-lg overflow-auto"
    :class="[
      helperStore.onFetch ? 'animate-pulse pointer-events-none opacity-50' : '',
      tableOverflow || stickyHeader ? '' : 'md:overflow-hidden',
      stickyHeader ? 'tb-sticky-head' : '',
    ]">
    <table
      class="md:table-auto w-full"
      :class="[
        stickyHeader ? 'border-separate border-spacing-y-0' : 'border-separate border-spacing-y-2',
        tableFixed ? '!table-fixed' : '',
        tableClass,
      ]"
      v-if="helperStore.onFetch"
    >
      <thead>
        <TbRow type="head">
          <TbHead> <div class="w-full h-[24px] bg-text-300 rounded-lg"></div> </TbHead>
          <TbHead> <div class="w-full h-[24px] bg-text-300 rounded-lg"></div> </TbHead>
          <TbHead> <div class="w-full h-[24px] bg-text-300 rounded-lg"></div> </TbHead>
          <TbHead> <div class="w-full h-[24px] bg-text-300 rounded-lg"></div> </TbHead>
          <TbHead> <div class="w-full h-[24px] bg-text-300 rounded-lg"></div> </TbHead>
          <TbHead> <div class="w-full h-[24px] bg-text-300 rounded-lg"></div> </TbHead>
        </TbRow>
      </thead>
      <tbody>
        <template v-if="size <= 50">
          <TbRow v-for="index in size" :key="`skeleton-${index}`">
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
          </TbRow>
        </template>
        <template v-else>
          <TbRow v-for="index in 10" :key="`skeleton-${index}`">
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
            <TbData> <div class="w-full h-[24px] bg-text-200 rounded-lg"></div> </TbData>
          </TbRow>
        </template>
      </tbody>
    </table>

    <table
      :class="[
        tableOverflow ? 'table-auto min-w-max w-full' : 'md:table-auto w-full',
        stickyHeader ? 'border-separate border-spacing-y-0' : 'border-separate border-spacing-y-2',
        tableFixed ? '!table-fixed' : '',
        tableClass,
      ]"
      v-else
    >
      <slot></slot>
    </table>
  </div>
</template>

<script setup>
import { useHelperStore } from '@/stores/helper.store';
const helperStore = useHelperStore();

/**
 * @type {{
 * tableFixed: boolean,
 * tableClass: string,
 * size: number,
 * data: any
 * }}
 */
const props = defineProps({
  tableFixed: {
    type: Boolean,
    default: false
  },
  tableOverflow: {
    type: Boolean,
    default: false
  },
  stickyHeader: {
    type: Boolean,
    default: false
  },
  tableClass: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 5
  },
  data: {
    type: null,
    default: 'no data'
  }
})
</script>

<style>
.tb-sticky-head {
  isolation: isolate;
}
.tb-sticky-head tr.bg-base-section > * {
  position: sticky;
  top: 0;
  z-index: 20;
  background: inherit;
}
/* Top-left corner cell: above both sticky header row and sticky left column */
.tb-sticky-head tr.bg-base-section > .sticky.left-0 {
  z-index: 30;
}
</style>