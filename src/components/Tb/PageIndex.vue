<template>
  <div v-if="helperStore.page_index.total_page !== 0" class="mt-auto" :class="helperStore.onFetch ? 'opacity-50 pointer-events-none' : ''">
    <hr v-if="hr" class="my-6">

    <div class="flex w-full mt-3 justify-between md:items-center">
      <p class="hidden md:block font-normal text-sm">
        <span class="text-base-black">Menampilkan {{ helperStore.page_index?.first }} sampai {{ helperStore.page_index?.last }}</span>&nbsp;
        <span class="text-base-black">dari {{ helperStore.page_index?.total }} keseluruhan</span>
      </p>

      <div class="flex gap-1 w-fit font-semibold text-sm text-base-black">

        <!-- prev -->
        <button
          type="button"
          @click="modelValue--"
          :disabled="modelValue <= 1"
          class="hidden md:block opacity-80 hover:opacity-100 bg-base-section rounded-md px-3 py-2 disabled:opacity-40"
        >
          <i class="fi fi-br-angle-small-left"></i>
        </button>

        <!-- PAGE 1 -->
        <button
          type="button"
          @click="modelValue = 1"
          :class="btnClass(1)"
          class="rounded px-3 py-2"
        >
          1
        </button>

        <!-- Ellipsis left -->
        <button type="button" disabled v-if="modelValue > 3" class="rounded px-3 py-2">…</button>

        <!-- Middle pages: modelValue-1, modelValue, modelValue+1 -->
        <template v-for="p in middlePages" :key="p">
          <button
            v-if="p !== 1 && p !== helperStore.page_index.total_page"
            type="button"
            @click="modelValue = p"
            :class="btnClass(p)"
            class="rounded px-3 py-2"
          >
            {{ p }}
          </button>
        </template>

        <!-- Ellipsis right -->
        <button type="button" disabled v-if="modelValue < helperStore.page_index.total_page - 2" class="rounded px-3 py-2">…</button>

        <!-- LAST PAGE -->
        <button
          v-if="helperStore.page_index.total_page > 1"
          type="button"
          @click="modelValue = helperStore.page_index.total_page"
          :class="btnClass(helperStore.page_index.total_page)"
          class="rounded px-3 py-2"
        >
          {{ helperStore.page_index.total_page }}
        </button>

        <!-- next -->
        <button
          type="button"
          @click="modelValue++"
          :disabled="modelValue >= helperStore.page_index.total_page"
          class="hidden md:block opacity-80 hover:opacity-100 bg-base-section rounded-md px-3 py-2 disabled:opacity-40"
        >
          <i class="fi fi-br-angle-small-right"></i>
        </button>

      </div>
    </div>
  </div>

  <div class="md:px-12" v-else-if="!helperStore.onFetch && helperStore.page_index.total_page == 0">
    <PartialEmptyState :title="empty_title" :desc="empty_desc">
      <slot name="button" />
    </PartialEmptyState>
  </div>
</template>

<script setup>
import { useHelperStore } from '@/stores/helper.store';
import { computed } from 'vue';

const helperStore = useHelperStore();

const modelValue = defineModel({
  type: Number,
  required: true,
});
const props = defineProps({
  empty_title: String,
  empty_desc: String,
  hr: Boolean,
});

// generate pages around current modelValue
const middlePages = computed(() => {
  const cur = modelValue.value;
  const total = helperStore.page_index.total_page;

  const pages = [];

  for (let p = cur - 1; p <= cur + 1; p++) {
    if (p > 1 && p < total) pages.push(p);
  }

  return pages;
});

// class for active vs normal button
const btnClass = (p) =>
  modelValue.value === p
    ? 'bg-primary-500 text-base-white'
    : 'bg-base-white opacity-80 hover:opacity-100';

</script>
