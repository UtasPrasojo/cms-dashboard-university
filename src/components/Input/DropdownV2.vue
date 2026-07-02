<template>
  <div ref="dropdown_container" class="overflow-hidden" :class="disabled ? 'pointer-events-none' : ''">
    <p v-if="label" class="font-medium text-xs md:text-sm text-text-500 mb-1">
      {{ label }}<span class="text-red-500" v-if="required">*</span>
    </p>
    <div class="relative">
      <button
        ref="dropdown_button"
        type="button"
        class="flex px-3 w-full py-2 text-xs md:text-sm border rounded-lg text-text-500 overflow-hidden"
        :class="[
          error ? 'button-error' : show ? 'button-active' : 'button-inactive',
          disabled ? '!bg-gray-100 !text-text-400' : '',
        ]"
        @click="openModal()"
        @keydown="handleKeydown"
      >
        <div class="flex gap-2 justify-between w-full min-w-0 text-xs md:text-sm">
          <div class="flex items-center min-w-0 gap-1 overflow-hidden">
            <p class="truncate">{{ displayLabel }}</p>
            <div
              class="flex items-center bg-information-100 text-information-500 rounded-lg text-xs px-3 py-1 font-semibold"
              v-if="selected?.desc"
            >
              {{ selected?.desc }}
            </div>
          </div>
          <i v-if="!disabled"
            class="fi fi-rr-angle-small-down inline-flex items-center justify-center"
            :class="{ 'rotate-180': show }"
          ></i>
        </div>
      </button>
      <div class="w-full h-full absolute top-0 px-[1px] pointer-events-none">
        <input
          @invalid="handleInvalid()"
          :disabled="disabled"
          type="text"
          class="input-style pointer-events-none"
          tabindex="-1"
          :required="required"
          :name="label"
          :value="modelValue"
        />
      </div>
    </div>
    <p class="mt-1 font-bold leading-none text-[9px] text-primary-500" v-if="description"> {{ description ?? '' }} </p>
    <div v-if="show" class="w-full">
      <div
        class="fixed top-0 left-0 w-screen h-screen bg-transparent z-40"
        @click="closeModal()"
        @wheel.passive="closeModal()"
        @touchmove.passive="closeModal()"
      ></div>
      <div
        ref="dropdown_menu"
        class="fixed bg-base-white border border-gray-300 rounded-lg z-50 elevation-2 overflow-hidden"
        :class="on_top ? '-translate-y-[calc(100%+50px)]' : ''"
        :style="`width: ${$refs.dropdown_container.clientWidth}px; top: ${
          $refs.dropdown_container.getBoundingClientRect().y +
          $refs.dropdown_container.clientHeight
        }px; left: ${$refs.dropdown_container.getBoundingClientRect().x}px`"
        @keydown="handleKeydown"
      >
        <div class="flex flex-col gap-1 p-2 w-full max-h-[300px] overflow-hidden">
          <div class="relative focus-within:text-primary-500" v-if="with_search">
            <input
              ref="search_input"
              name="search"
              class="w-full p-3 py-[6px] border text-xs md:text-sm border-primary-100 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
              type="text"
              :placeholder="placeholder_search"
              v-model="search_value"
              @keydown="handleSearchKeydown"
              @focus="handleSearchFocus"
              :label="null"
            />
              <i
            class="fi fi-rr-search absolute right-2 top-1/2 -translate-y-1/2 text-sm transition-colors pointer-events-none"
          ></i>
          </div>
          <div ref="options_container" class="grid overflow-auto gap-0">
            <template v-if="helperStore.master_data[name]?.length > 0">
              <button type="button" @click="$emit('update:modelValue', ''); closeModal(); $emit('selected', null)" v-if="withAll"
                class="flex items-center gap-1 text-start font-medium text-xs md:text-sm py-2 px-4 rounded" :class="modelValue == null ? 'bg-primary-50 text-primary-500' : 'hover:bg-base-section'">
                {{ placeholder }}
              </button>
              <template v-for="opt, opt_index in helperStore.master_data[name]" :key="opt.value">
                <p v-if="typeof opt == 'string'" class="text-start text-xs md:text-sm p-3 text-text-500 font-bold">
                  {{ opt }}
                </p>
                <button
                  type="button"
                  @click="selectOption(opt)"
                  v-else
                  ref="option_buttons"
                  :data-index="opt_index"
                  class="flex items-center gap-1 text-start font-medium text-xs md:text-sm py-2 px-4 rounded"
                  :class="[
                    modelValue == opt[value_key]
                      ? 'bg-primary-500 text-base-white'
                      : 'hover:bg-base-section',
                    highlightedIndex === opt_index ? 'bg-base-section' : ''
                  ]"
                >
                  {{ opt.label }}
                  <div class="flex items-center bg-information-100 text-information-500 rounded-lg text-[10px] px-3 py-1 font-semibold" v-if="opt?.desc">
                    {{ opt?.desc }}
                  </div>
                </button>
              </template>
            </template>
            <p v-else class="flex items-center gap-1 text-start text-[11px] leading-3 p-2 text-text-400">
              <IconSearchEmpty class="flex-none" />
              <span>Pencarian tidak ditemukan</span>
            </p>
            <p v-if="with_infinite_scroll && isLoadingMore" class="text-center text-xs text-text-400 py-2">Memuat...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useHelperStore } from "@/stores/helper.store.js";
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from "vue";
const helperStore = useHelperStore();

/**
 * @type {{
 * name: string,
 * modelValue: [string, number, array],
 * options: array,
 * with_search: boolean,
 * label: string,
 * placeholder: string,
 * required: boolean,
 * disabled: boolean,
 * filterBy: object,
 * withAll: boolean
 * placeholder_search: string,
 * }}
 */
const props = defineProps({
  name: { type: String, default: "" },
  modelValue: { type: [String, Number, Array], default: null },
  options: { type: Array, default: () => [] },
  with_search: { type: Boolean, default: false },
  placeholder_search: { type: String, default: "Pencarian ..." },
  label: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  filterBy: { type: Object, default: () => ({}) },
  description: { type: String, default: null },
  withAll: { type: Boolean, default: true },
  with_infinite_scroll: { type: Boolean, default: false },
  value_key: { type: String, default: 'value' }
});
const emit = defineEmits(["update:modelValue", "search", "selected"]);

const dropdown_menu = ref()
const dropdown_container = ref()
const dropdown_button = ref()
const search_input = ref()
const options_container = ref()
const option_buttons = ref([])

const show = ref(false);
const search_value = ref("");
const selected = ref(null);
const timeout = ref(null);
const on_top = ref(false);
const error = ref(false);
const highlightedIndex = ref(-1);
const isLoadingMore = ref(false);
const ignore_scroll = ref(false);
const ignore_scroll_timeout = ref(null);

const handleOptionsScroll = async () => {
  const container = options_container.value
  if (!container || isLoadingMore.value) return
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 20) {
    isLoadingMore.value = true
    await helperStore.fetchMasterNext(props.name)
    isLoadingMore.value = false
  }
};

// Pada iPad/iOS, virtual keyboard yang muncul memicu viewport resize
// yang men-trigger scroll event di parent scrollable, dan dropdown akan
// langsung tertutup. Flag ini menahan handler scroll-close sebentar.
const isTouchDevice = typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const suspendScrollClose = (ms = 500) => {
  ignore_scroll.value = true;
  clearTimeout(ignore_scroll_timeout.value);
  ignore_scroll_timeout.value = setTimeout(() => {
    ignore_scroll.value = false;
  }, ms);
};

const handleSearchFocus = () => {
  suspendScrollClose();
};

// Computed untuk get valid options (exclude string headers)
const validOptions = computed(() => {
  return helperStore.master_data[props.name]?.filter(opt => typeof opt !== 'string') || [];
});

onMounted(async () => {
  const res = await helperStore.fetchMaster(props.name, '', props.filterBy);
  if (res) {
    selected.value = helperStore.master_data[props.name]?.find(
      (opt) => opt[props.value_key] == props.modelValue
    );
  }
});

const handleInvalid = () => {
  nextTick(() => {
    error.value = true;
  });
};

const inputDebounce = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    helperStore.fetchMaster(props.name, props.search_value, props.filterBy)
    helperStore.fetchMaster(props.name, search_value.value, props.filterBy);
  }, 0);
};

// Function untuk select option
const selectOption = (opt) => {
  emit('update:modelValue', opt[props.value_key]);
  closeModal();
  emit('selected', opt);
};

// Function scroll ke highlighted item
const scrollToHighlighted = () => {
  nextTick(() => {
    if (highlightedIndex.value >= 0 && option_buttons.value[highlightedIndex.value]) {
      const button = option_buttons.value[highlightedIndex.value];
      const container = options_container.value;
      
      if (button && container) {
        const buttonTop = button.offsetTop;
        const buttonBottom = buttonTop + button.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        
        if (buttonBottom > containerBottom) {
          container.scrollTop = buttonBottom - container.clientHeight;
        } else if (buttonTop < containerTop) {
          container.scrollTop = buttonTop;
        }
      }
    }
  });
};

// Handler keyboard untuk dropdown
const handleKeydown = (e) => {
  if (!show.value) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      openModal();
    }
    return;
  }

  // If search input is focused, let it handle its own keys
  if (props.with_search && document.activeElement === search_input.value) {
    return;
  }

  const maxIndex = validOptions.value.length - 1;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (highlightedIndex.value < maxIndex) {
        highlightedIndex.value++;
      } else {
        highlightedIndex.value = 0; // Loop back to first
      }
      scrollToHighlighted();
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
      } else {
        highlightedIndex.value = maxIndex; // Loop to last
      }
      scrollToHighlighted();
      break;
      
    case 'Enter':
      e.preventDefault();
      if (highlightedIndex.value >= 0 && validOptions.value[highlightedIndex.value]) {
        const opt = validOptions.value[highlightedIndex.value];
        selectOption(opt);
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      closeModal();
      dropdown_button.value?.focus();
      break;
      
    case 'Tab':
      closeModal();
      break;
      
    // Allow typing to focus back to search
    case '/':
      if (props.with_search) {
        e.preventDefault();
        search_input.value?.focus();
        highlightedIndex.value = -1;
      }
      break;
      
    // Type-to-search behavior when no search input
    default:
      if (props.with_search && e.key.length === 1) {
        search_input.value?.focus();
        // Let the character be typed in search
      }
      break;
  }
};

// Handler keyboard untuk search input
const handleSearchKeydown = (e) => {
  const maxIndex = validOptions.value.length - 1;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      // Move to first option and blur search
      if (validOptions.value.length > 0) {
        highlightedIndex.value = 0;
        search_input.value?.blur(); // Remove focus from search
        dropdown_menu.value?.focus(); // Focus dropdown for navigation
        scrollToHighlighted();
      }
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      // Move to last option and blur search
      if (validOptions.value.length > 0) {
        highlightedIndex.value = maxIndex;
        search_input.value?.blur();
        dropdown_menu.value?.focus();
        scrollToHighlighted();
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      // Clear search and close
      search_value.value = "";
      helperStore.fetchMaster(props.name, "", props.filterBy);
      closeModal();
      dropdown_button.value?.focus();
      break;
      
    case 'Enter':
      e.preventDefault();
      // Select first result if highlighted, otherwise first option
      if (validOptions.value.length > 0) {
        const optToSelect = highlightedIndex.value >= 0 
          ? validOptions.value[highlightedIndex.value]
          : validOptions.value[0];
        selectOption(optToSelect);
      }
      break;
      
    default:
      // Reset highlight when typing
      highlightedIndex.value = -1;
      inputDebounce();
      break;
  }
};

// Handler scroll window
const handleScroll = () => {
  if (ignore_scroll.value) return;
  closeModal();
};

const openModal = () => {
  show.value = true;
  error.value = false;
  highlightedIndex.value = -1;

  // Add scroll listener only to scrollable parent elements (not dropdown itself)
  nextTick(() => {
    const scrollableParent = findScrollableParent(dropdown_container.value);
    if (scrollableParent) {
      scrollableParent.addEventListener('scroll', handleScroll);
    }

    if (dropdown_menu.value) {
      const app = document.getElementById("app");
      if (app) {
        on_top.value =
          dropdown_menu.value.getBoundingClientRect().bottom >
          app.getBoundingClientRect().bottom;
      }
    }

    // Skip auto-focus search di touch device — virtual keyboard yang muncul
    // memicu viewport resize → scroll event → dropdown menutup secara instant.
    if (props.with_search && search_input.value && !isTouchDevice) {
      search_input.value.focus();
    }

    if (props.with_infinite_scroll && options_container.value) {
      options_container.value.addEventListener('scroll', handleOptionsScroll)
    }

    const selectedIdx = validOptions.value.findIndex(
      opt => opt[props.value_key] === props.modelValue
    );
    if (selectedIdx >= 0) {
      highlightedIndex.value = selectedIdx;
      scrollToHighlighted();
    }
  });
};

const closeModal = () => {
  show.value = false;
  on_top.value = false;
  highlightedIndex.value = -1;

  // Remove scroll listener from scrollable parent
  const scrollableParent = findScrollableParent(dropdown_container.value);
  if (scrollableParent) {
    scrollableParent.removeEventListener('scroll', handleScroll);
  }
  clearTimeout(ignore_scroll_timeout.value);
  ignore_scroll.value = false;

  if (props.with_search) {
    search_value.value = "";
    helperStore.fetchMaster(props.name, "", props.filterBy);
  }
  if (props.with_infinite_scroll && options_container.value) {
    options_container.value.removeEventListener('scroll', handleOptionsScroll)
  }
};

// Helper function to find scrollable parent
const findScrollableParent = (element) => {
  if (!element) return null;
  
  let parent = element.parentElement;
  while (parent) {
    const overflow = window.getComputedStyle(parent).overflow;
    if (overflow === 'auto' || overflow === 'scroll') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
};

onUnmounted(() => {
  helperStore.form_error = [];
  const scrollableParent = findScrollableParent(dropdown_container.value);
  if (scrollableParent) {
    scrollableParent.removeEventListener('scroll', handleScroll);
  }
  clearTimeout(ignore_scroll_timeout.value);
});

const displayLabel = computed(() => {
  if (selected.value?.[props.value_key]) {
    return selected.value.label;
  }
  if (props.placeholder) {
    return props.placeholder;
  }
  return "Pilih Opsi";
});

onUnmounted(() => {
  helperStore.form_error = [];
  window.removeEventListener('scroll', handleScroll, true);
});

watch(
  () => props.modelValue,
  () => {
    if (helperStore.master_data[props.name]) {
      selected.value = helperStore.master_data[props.name]?.find(
        (opt) => opt[props.value_key] == props.modelValue
      );
      error.value = false;
    }
  },
  { immediate: true, deep: true }
);
watch(
  () => props.filterBy,
  () => {
    helperStore.fetchMaster(props.name, props.search_value, props.filterBy);
  },
  { deep: true }
);
watch(
  () => "helperStore.form_error",
  () => {
    error.value = helperStore.form_error.some(
      (res) => res?.item_name == props.name
    );
  },
  { deep: true, immediate: true }
);
</script>

<style scoped>
.button-inactive {
  @apply bg-base-white border-border-400 hover:bg-slate-50 text-sm focus:outline-primary-500 focus:bg-primary-100;
}
.button-active {
  @apply border-primary-500 bg-primary-50 hover:bg-slate-50 text-sm;
}
.button-error {
  @apply border-red-500 bg-red-50/50 text-sm;
}

.input-style {
  @apply appearance-none w-full h-full opacity-0 pointer-events-none;
}
</style>